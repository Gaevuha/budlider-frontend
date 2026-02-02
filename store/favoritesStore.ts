import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
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

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      setFavorites: (favorites) => set({ favorites }),

      addFavorite: (productId) =>
        set((state) => {
          if (state.favorites.includes(productId)) {
            return state;
          }
          return {
            favorites: [...state.favorites, productId],
          };
        }),

      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        })),

      toggleFavorite: (productId) =>
        set((state) => {
          if (state.favorites.includes(productId)) {
            return {
              favorites: state.favorites.filter((id) => id !== productId),
            };
          }
          return {
            favorites: [...state.favorites, productId],
          };
        }),

      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "budlider-favorites-storage",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => dynamicStorage),
    }
  )
);
