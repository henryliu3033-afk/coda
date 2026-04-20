import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API = 'http://localhost:8000/api/user'

export const useAuth = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      register: async (name, email, password) => {
        const res = await fetch(`${API}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || '註冊失敗')
        return data
      },

      login: async (email, password) => {
        const res = await fetch(`${API}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || '登入失敗')
        set({ token: data.access_token, user: data.user })
        return data
      },

      logout: () => set({ token: null, user: null }),

      fetchMe: async () => {
        const { token } = get()
        if (!token) return
        const res = await fetch(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) { set({ token: null, user: null }); return }
        set({ user: await res.json() })
      },
    }),
    {
      name: 'coda-auth',
      partialize: s => ({ token: s.token, user: s.user }),
    }
  )
)

export const isLoggedIn = s => !!s.token
