import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersStorage } from "@/lib/utils/localStorage";
import { Order } from "@/types/index";
import { toast } from "@/lib/utils/toast";

interface QuickOrderData {
  productId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  comment?: string;
}

// Hook для створення швидкого замовлення
export function useCreateQuickOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuickOrderData) => {
      // Симуляція API запиту
      await new Promise((resolve) => setTimeout(resolve, 500));

      const order: Order = {
        id: `order-${Date.now()}`,
        userId: undefined,
        items: [
          {
            product: data.productId,
            name: "", // Буде заповнено з продукту
            price: 0, // Буде заповнено з продукту
            quantity: data.quantity,
            total: 0, // Буде обчислено
          },
        ],
        total: 0,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: "",
        deliveryMethod: "self-pickup",
        deliveryAddress: "",
        paymentMethod: "cash",
        status: "pending",
        createdAt: new Date().toISOString(),
        comment: data.comment,
      };

      ordersStorage.addOrder(order);
      return order;
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
