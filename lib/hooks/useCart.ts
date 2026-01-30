import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types';

// Hook для отримання кошика
export function useCart() {
  const items = useCartStore((state) => state.items);
  
  return {
    items,
    isLoading: false,
  };
}

// Hook для додавання товару до кошика
export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      addItem(productId, quantity);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Hook для видалення товару з кошика
export function useRemoveFromCart() {
  const removeItem = useCartStore((state) => state.removeItem);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => {
      removeItem(productId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Hook для оновлення кількості товару
export function useUpdateCartQuantity() {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => {
      updateQuantity(productId, quantity);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Hook для очищення кошика
export function useClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      clearCart();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}