import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'

const AuthCtx = createContext({ user: null, loading: true, setUser: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    async function fetchMe() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) { setLoading(false); return }
      try {
        const res = await api.get('/me')
        if (!ignore) setUser(res.data.user)
      } catch {
        // token invalid -> clear
        localStorage.removeItem('token')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchMe()
    return () => { ignore = true }
  }, [])

  return <AuthCtx.Provider value={{ user, loading, setUser }}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }
