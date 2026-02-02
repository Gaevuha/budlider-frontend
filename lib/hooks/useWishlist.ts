import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  addToWishlistClient,
  fetchWishlistClient,
  removeFromWishlistClient,
} from "@/lib/api/apiClient";

// Hook для отримання списку обраного
export function useWishlist() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const { user } = useAuth();

  useQuery({
    queryKey: ["wishlist", user?._id],
    enabled: Boolean(user),
    queryFn: async () => {
      const res = await fetchWishlistClient();
      const raw =
        res?.data?.items ||
        res?.items ||
        res?.data?.wishlist ||
        res?.wishlist ||
        res?.data ||
        [];

      if (!Array.isArray(raw)) return [];

      const normalized = raw
        .map((item: any) =>
          typeof item === "string"
            ? item
            : item?.productId || item?.product?._id || item?._id || item?.id
        )
        .filter(Boolean);

      setFavorites(normalized);
      return normalized;
    },
  });

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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      toggleFavorite(productId);
      if (user) {
        if (useFavoritesStore.getState().isFavorite(productId)) {
          await addToWishlistClient(productId);
        } else {
          await removeFromWishlistClient(productId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

// Hook для додавання в обране
export function useAddToWishlist() {
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      addFavorite(productId);
      if (user) {
        await addToWishlistClient(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

// Hook для видалення з обраного
export function useRemoveFromWishlist() {
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      removeFavorite(productId);
      if (user) {
        await removeFromWishlistClient(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
