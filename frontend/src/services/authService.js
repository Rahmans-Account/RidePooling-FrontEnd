import api, { setAuthToken } from './api'

const STORAGE_KEY = 'rp_auth'

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password })
  const { token, user } = res.data.data
  // persist
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
  setAuthToken(token)
  return { token, user }
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  setAuthToken(null)
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export function initAuthFromStorage() {
  const auth = getAuth()
  if (auth && auth.token) setAuthToken(auth.token)
}

export default { login, logout, getAuth, initAuthFromStorage }
