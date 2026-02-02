import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const getStorage = () => {
  if (typeof window === "undefined") return undefined;
  const hasAuth = Boolean(localStorage.getItem("user"));
  return hasAuth ? localStorage : sessionStorage;
};

const dynamicStorage: StateStorage = {
  getItem: (name) => getStorage()?.getItem(name) ?? null,
  setItem: (name, value) => {
    getStorage()?.setItem(name, value);
  },
  removeItem: (name) => {
    getStorage()?.removeItem(name);
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (items) => set({ items }),

      addItem: (productId, quantity) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === productId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { productId, quantity }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        // Тут потрібно буде підтягувати ціни з products
        // Поки що повертаємо 0
        return 0;
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "budlider-cart-storage",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => dynamicStorage),
    }
  )
);
