"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ModalWrapper from "@/components/ui/modalwrapper/ModalWrapper";
import { useCreateQuickOrder } from "@/lib/hooks/useOrders";
import { Product } from "@/types/index";
import styles from "./QuickOrderModal.module.css";

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface QuickOrderFormData {
  name: string;
  phone: string;
  comment: string;
}

const schema = yup.object({
  name: yup.string().required("Обов'язкове поле"),
  phone: yup.string().required("Обов'язкове поле"),
  comment: yup.string().default(""),
});
export function QuickOrderModal({
  isOpen,
  onClose,
  product,
}: QuickOrderModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createOrderMutation = useCreateQuickOrder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickOrderFormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", phone: "", comment: "" },
  });

  const onSubmit: SubmitHandler<QuickOrderFormData> = async (data) => {
    if (!product) return;
    try {
      await createOrderMutation.mutateAsync({
        productId: product._id,
        quantity: 1,
        customerName: data.name,
        customerPhone: data.phone,
        comment: data.comment || undefined,
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      {isSubmitted ? (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Замовлення прийнято!</h2>
          <p className={styles.successText}>
            Наш менеджер зв'яжеться з вами найближчим часом
          </p>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Швидке замовлення</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X />
            </button>
          </div>

          <div className={styles.productInfo}>
            <img
              src={product.mainImage}
              alt={product.name}
              className={styles.productImage}
            />
            <div>
              <h3>{product.name}</h3>
              <p>{product.brand}</p>
              <p>{product.price} грн</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input
              {...register("name")}
              placeholder="Ім'я"
              className={styles.input}
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}

            <input
              {...register("phone")}
              placeholder="Телефон"
              className={styles.input}
            />
            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}

            <textarea
              {...register("comment")}
              placeholder="Коментар"
              className={styles.textarea}
            />
            {errors.comment && (
              <p className={styles.error}>{errors.comment.message}</p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? "Відправка..." : "Замовити"}
            </button>
          </form>
        </>
      )}
    </ModalWrapper>
  );
}
