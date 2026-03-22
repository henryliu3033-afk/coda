import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      add: (event, ticket, qty = 1) => {
        const key = `${event.id}_${ticket.id}`
        const items = get().items
        const idx   = items.findIndex(i => i.key === key)
        if (idx >= 0) {
          const next = [...items]
          next[idx] = { ...next[idx], qty: next[idx].qty + qty }
          set({ items: next })
        } else {
          set({ items: [...items, { key, event, ticket, qty }] })
        }
      },

      remove:  key => set({ items: get().items.filter(i => i.key !== key) }),
      setQty:  (key, qty) => {
        if (qty < 1) { get().remove(key); return }
        set({ items: get().items.map(i => i.key === key ? { ...i, qty } : i) })
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'coda-cart' }
  )
)

export const total = s => s.items.reduce((n, i) => n + i.ticket.price * i.qty, 0)
export const count = s => s.items.reduce((n, i) => n + i.qty, 0)
