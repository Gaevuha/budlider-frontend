import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFavoritesStore } from '@/store/favoritesStore';

// Hook для отримання списку обраного
export function useWishlist() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  
  return {
    favorites,
    isFavorite,
    isLoading: false,
  };
}

// Hook для додавання/видалення з обраного
export function useToggleWishlist() {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => {
      toggleFavorite(productId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Hook для додавання в обране
export function useAddToWishlist() {
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => {
      addFavorite(productId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Hook для видалення з обраного
export function useRemoveFromWishlist() {
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => {
      removeFavorite(productId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}