import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOrders = create(
  persist(
    (set, get) => ({
      orders: [],
      place: (items, total, info) => {
        const order = {
          id: `CODA-${Date.now()}`,
          items, total, info,
          createdAt: new Date().toISOString(),
        }
        set({ orders: [order, ...get().orders] })
        return order
      },
    }),
    { name: 'coda-orders' }
  )
)
