"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ModalWrapper from "@/components/ui/modalwrapper/ModalWrapper";
import { useCreateQuickOrder } from "@/lib/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/index";
import styles from "./QuickOrderModal.module.css";
import Image from "next/image";

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
  const [quantity, setQuantity] = useState(1);
  const createOrderMutation = useCreateQuickOrder();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm<QuickOrderFormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", phone: "", comment: "" },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({
      name: user?.name || "",
      phone: user?.phone || "",
      comment: "",
    });
  }, [isOpen, reset, user?.name, user?.phone]);

  const onSubmit: SubmitHandler<QuickOrderFormData> = async (data) => {
    if (!product) return;
    try {
      const resolvedName = data.name || user?.name || "";
      const resolvedPhone = data.phone || user?.phone || "";

      await createOrderMutation.mutateAsync({
        items: [{ productId: product._id, quantity }],
        shippingAddress: {
          name: resolvedName,
          phone: resolvedPhone,
          city: "Невідомо",
          street: "Невідомо",
          building: "Невідомо",
        },
        deliveryMethod: "pickup",
        paymentMethod: "cash",
        status: "new",
        name: resolvedName,
        phone: resolvedPhone,
        comment: data.comment || "",
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
            <Image
              src={product.mainImage}
              alt={product.name}
              className={styles.productImage}
              width={80}
              height={80}
            />
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productBrand}>{product.brand}</p>
              <p className={styles.productPrice}>{product.price} грн</p>
              <p className={styles.productTotal}>
                Сума: {(product.price * quantity).toFixed(2)} грн
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Кількість</label>
              <div className={styles.quantityControls}>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className={styles.quantityButton}
                  aria-label="Зменшити кількість"
                >
                  <Minus className={styles.quantityIcon} />
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className={styles.quantityButton}
                  aria-label="Збільшити кількість"
                >
                  <Plus className={styles.quantityIcon} />
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Ім'я <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={`${styles.input} ${
                  touchedFields.name && errors.name ? styles.inputError : ""
                }`}
                placeholder="Введіть ваше ім'я"
              />
              {touchedFields.name && errors.name && (
                <span className={styles.errorMessage}>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Телефон <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className={`${styles.input} ${
                  touchedFields.phone && errors.phone ? styles.inputError : ""
                }`}
                placeholder="+380501234567"
              />
              {touchedFields.phone && errors.phone && (
                <span className={styles.errorMessage}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="comment" className={styles.label}>
                Коментар
              </label>
              <textarea
                id="comment"
                {...register("comment")}
                rows={3}
                className={`${styles.textarea} ${
                  touchedFields.comment && errors.comment
                    ? styles.inputError
                    : ""
                }`}
                placeholder="Додаткова інформація (необов'язково)"
              />
              {touchedFields.comment && errors.comment && (
                <span className={styles.errorMessage}>
                  {errors.comment.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? "Відправка..." : "Замовити"}
            </button>

            <p className={styles.disclaimer}>
              Натискаючи кнопку "Замовити", ви даєте згоду на обробку
              персональних даних
            </p>
          </form>
        </>
      )}
    </ModalWrapper>
  );
}
