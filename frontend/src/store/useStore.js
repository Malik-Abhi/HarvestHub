import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      cartData: [],
      orders: [],
      products: [],

      setUser: (user, token) => set({ user, token, isAuthenticated: !!user }),
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
      removeFromCart: (productId) =>
        set((state) => ({
          cartData: state.cartData.filter((item) => item.id !== productId),
        })),
      clearCart: () => set({ cartData: [] }),
      setCartItems: (items) => set({ cartData: items }),
      setOrders: (orders) => set({ orders }),
      clearOrders: () => set({ orders: [] }),

      setProducts: (products) => set({ products }),
    }),
    {
      name: 'app-storage', // key for localStorage
    }
  )
);
