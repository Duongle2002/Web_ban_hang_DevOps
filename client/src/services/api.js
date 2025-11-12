import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  // Important: avoid withCredentials when server uses CORS "*"
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
})

// Initialize token from localStorage if exists
const saved = typeof window !== 'undefined' ? localStorage.getItem('token') : null
if (saved) {
  api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
}

// Optional helper for auth token later
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api
