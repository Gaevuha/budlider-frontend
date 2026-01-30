"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFormik } from "formik";
import { Product } from "@/types";
import { useCreateQuickOrder } from "@/lib/hooks/useOrders";
import {
  quickOrderSchema,
  QuickOrderFormData,
} from "@/lib/schemas/quickOrderSchema";
import { Portal } from "@/components/ui/portal/Portal";
import styles from "./QuickOrderModal.module.css";

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function QuickOrderModal({
  isOpen,
  onClose,
  product,
}: QuickOrderModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createOrderMutation = useCreateQuickOrder();

  const formik = useFormik<QuickOrderFormData>({
    initialValues: {
      name: "",
      phone: "",
      comment: "",
    },
    validationSchema: quickOrderSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!product) return;

      try {
        await createOrderMutation.mutateAsync({
          productId: product._id,
          quantity: 1,
          customerName: values.name,
          customerPhone: values.phone,
          comment: values.comment || undefined,
        });

        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          resetForm();
          onClose();
        }, 2000);
      } catch (error) {
        // Помилка обробляється в хуку
        console.error("Quick order error:", error);
      }
    },
  });

  // Блокування скролу body при відкритті модалки
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!product) return null;

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.backdrop}
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={styles.modal}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
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
                  {/* Header */}
                  <div className={styles.header}>
                    <h2 className={styles.title}>Швидке замовлення</h2>
                    <button
                      onClick={onClose}
                      className={styles.closeButton}
                      aria-label="Закрити"
                    >
                      <X className={styles.closeIcon} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className={styles.productInfo}>
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productBrand}>{product.brand}</p>
                      <p className={styles.productPrice}>{product.price} грн</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.label}>
                        Ім'я <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`${styles.input} ${
                          formik.touched.name && formik.errors.name
                            ? styles.inputError
                            : ""
                        }`}
                        placeholder="Введіть ваше ім'я"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <span className={styles.errorMessage}>
                          {formik.errors.name}
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
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`${styles.input} ${
                          formik.touched.phone && formik.errors.phone
                            ? styles.inputError
                            : ""
                        }`}
                        placeholder="+380501234567"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <span className={styles.errorMessage}>
                          {formik.errors.phone}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="comment" className={styles.label}>
                        Коментар
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={3}
                        className={`${styles.textarea} ${
                          formik.touched.comment && formik.errors.comment
                            ? styles.inputError
                            : ""
                        }`}
                        placeholder="Додаткова інформація (необов'язково)"
                      />
                      {formik.touched.comment && formik.errors.comment && (
                        <span className={styles.errorMessage}>
                          {formik.errors.comment}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending
                        ? "Відправка..."
                        : "Замовити"}
                    </button>

                    <p className={styles.disclaimer}>
                      Натискаючи кнопку "Замовити", ви даєте згоду на обробку
                      персональних даних
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
