import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5003'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
})

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export default api
