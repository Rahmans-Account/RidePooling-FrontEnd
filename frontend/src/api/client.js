import axios from 'axios';

const buildApiBaseCandidates = () => {
  const explicitBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (explicitBase) {
    const normalizedExplicit = String(explicitBase).replace(/\/$/, '');
    try {
      const parsed = new URL(normalizedExplicit);
      const isLocalExplicit = ['localhost', '127.0.0.1'].includes(parsed.hostname);
      const explicitPort = Number(parsed.port || (parsed.protocol === 'https:' ? 443 : 80));

      if (isLocalExplicit && explicitPort >= 5003 && explicitPort <= 5004 && import.meta.env.MODE !== 'production') {
        const path = parsed.pathname.replace(/\/$/, '') || '/api';
        return Array.from({ length: 2 }, (_, offset) => `${parsed.protocol}//${parsed.hostname}:${5003 + offset}${path}`);
      }
    } catch {
      // If URL parsing fails, keep the explicit base as-is.
    }

    return [normalizedExplicit];
  }

  const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  if (!isLocalhost || import.meta.env.MODE === 'production') {
    return ['http://localhost:5003/api'];
  }

  return Array.from({ length: 2 }, (_, offset) => `http://localhost:${5003 + offset}/api`);
};

const API_BASE_CANDIDATES = buildApiBaseCandidates();
let activeBaseIndex = 0;

const api = axios.create({
  baseURL: API_BASE_CANDIDATES[activeBaseIndex],
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const method = String(originalRequest?.method || 'get').toLowerCase();
    const isIdempotentMethod = ['get', 'head', 'options'].includes(method);
    const requestUrl = String(originalRequest?.url || '');
    const isAuthLoginRequest = method === 'post' && /\/auth\/login(\?|$)/.test(requestUrl);
    const isNetworkFailure = !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED');
    const status = Number(error.response?.status || 0);
    const isRetriableServerFailure = status >= 500 && status < 600;
    const shouldRetry = isNetworkFailure || ((isIdempotentMethod || isAuthLoginRequest) && isRetriableServerFailure);

    if (!originalRequest || !shouldRetry || API_BASE_CANDIDATES.length <= 1) {
      return Promise.reject(error);
    }

    const retries = Number(originalRequest.__portRetryCount || 0);
    if (retries >= API_BASE_CANDIDATES.length - 1) {
      return Promise.reject(error);
    }

    activeBaseIndex = (activeBaseIndex + 1) % API_BASE_CANDIDATES.length;
    const nextBaseUrl = API_BASE_CANDIDATES[activeBaseIndex];
    originalRequest.__portRetryCount = retries + 1;
    originalRequest.baseURL = nextBaseUrl;
    api.defaults.baseURL = nextBaseUrl;

    return api.request(originalRequest);
  }
);

export default api;
