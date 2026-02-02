import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuickOrder } from "@/lib/api/apiClient";
import { toast } from "@/lib/utils/toast";

interface QuickOrderData {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    name: string;
    phone: string;
    city: string;
    street: string;
    building: string;
  };
  deliveryMethod: "courier" | "pickup" | "post";
  paymentMethod: "cash" | "card_delivery" | "card_online";
  status?: "new";
  name?: string;
  phone?: string;
  comment?: string;
}

// Hook для створення швидкого замовлення
export function useCreateQuickOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuickOrderData) => {
      return await createQuickOrder(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Замовлення успішно створено!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Помилка при створенні замовлення");
    },
  });
}
