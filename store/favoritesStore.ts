import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
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
          favorites: state.favorites.filter(id => id !== productId),
        })),
      
      toggleFavorite: (productId) =>
        set((state) => {
          if (state.favorites.includes(productId)) {
            return {
              favorites: state.favorites.filter(id => id !== productId),
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
      name: 'budlider-favorites-storage',
    }
  )
);
