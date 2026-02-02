import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  addToCartClient,
  clearCartClient,
  fetchCartClient,
  removeFromCartClient,
  updateCartItemClient,
} from "@/lib/api/apiClient";

// Hook для отримання кошика
export function useCart() {
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);
  const { user } = useAuth();

  useQuery({
    queryKey: ["cart", user?._id],
    enabled: Boolean(user),
    queryFn: async () => {
      const res = await fetchCartClient();
      const raw =
        res?.data?.items ||
        res?.items ||
        res?.data?.cart?.items ||
        res?.data?.cart ||
        res?.cart?.items ||
        res?.cart ||
        res?.data ||
        [];

      if (!Array.isArray(raw)) return [];

      const normalized = raw
        .map((item: any) => ({
          productId:
            item?.productId ||
            item?.product?._id ||
            item?.product ||
            item?._id ||
            item?.id,
          quantity: Number(item?.quantity ?? item?.qty ?? 1),
        }))
        .filter((item: any) => Boolean(item.productId));

      setItems(normalized);
      return normalized;
    },
  });

  return {
    items,
    isLoading: false,
  };
}

// Hook для додавання товару до кошика
export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      addItem(productId, quantity);
      if (user) {
        await addToCartClient({ productId, quantity });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Hook для видалення товару з кошика
export function useRemoveFromCart() {
  const removeItem = useCartStore((state) => state.removeItem);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      removeItem(productId);
      if (user) {
        await removeFromCartClient(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Hook для оновлення кількості товару
export function useUpdateCartQuantity() {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      updateQuantity(productId, quantity);
      if (user) {
        await updateCartItemClient(productId, { quantity });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Hook для очищення кошика
export function useClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      clearCart();
      if (user) {
        await clearCartClient();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
