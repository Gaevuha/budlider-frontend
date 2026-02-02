"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { DeliverySelection } from "@/components/DeliverySelection/DeliverySelection";
import { toast } from "@/lib/utils/toast";
import { useCart, useClearCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { CardPaymentForm } from "@/components/CardPaymentForm/CardPaymentForm";
import { fetchProductsClient } from "@/lib/api/apiClient";
import { createOrderClient } from "@/lib/api/apiClient";
import type { Product } from "@/types";
import {
  CreditCard,
  Banknote,
  Wallet,
  Truck,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Package, Mail } from "lucide-react";
import { Loader } from "@/components/ui/loader/Loader";
import styles from "./CheckoutPage.module.css";

// Валідація дати (MM/YY)
const isValidExpiryDate = (value: string | undefined) => {
  if (!value) return false;
  const [month, year] = value.split("/");
  if (!month || !year) return false;

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) return false;

  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;

  return true;
};

// Валідація номера картки (алгоритм Луна)
const isValidCardNumber = (value: string | undefined) => {
  if (!value) return false;
  const cardNumber = value.replace(/\s/g, "");

  if (!/^\d{13,19}$/.test(cardNumber)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const buildShippingAddress = (params: {
  name: string;
  phone: string;
  address: string;
}) => {
  const raw = params.address || "";
  const parts = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const city = parts[0] || raw || "Невідомо";
  const street = parts[1] || parts[0] || raw || "Невідомо";
  const building = parts[2] || "Невідомо";

  return {
    name: params.name || "",
    phone: params.phone || "",
    city,
    street,
    building,
  };
};

// Базова схема валідації
const baseValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Ім'я є обов'язковим")
    .min(2, "Ім'я має містити мінімум 2 символи"),
  phone: yup
    .string()
    .required("Телефон є обов'язковим")
    .matches(/^(\+380|380|0)[0-9]{9}$/, "Введіть коректний номер телефону"),
  email: yup.string().email("Введіть коректну email адресу"),
  address: yup
    .string()
    .required("Адреса доставки є обов'язковою")
    .min(5, "Адреса занадто коротка"),
  comment: yup.string(),
  deliveryMethod: yup
    .string()
    .oneOf(["novaposhta", "ukrposhta", "courier", "pickup"])
    .required("Виберіть спосб доставки"),
  paymentMethod: yup
    .string()
    .oneOf(["cash", "card_delivery", "card_online"])
    .required("Виберіть спосіб оплати"),
  cardNumber: yup.string().when("paymentMethod", {
    is: "card_online",
    then: (schema) =>
      schema
        .required("Номер картки є обов'язковим")
        .test("valid-card", "Невірний номер картки", isValidCardNumber),
    otherwise: (schema) => schema.optional(),
  }),
  cardHolder: yup.string().when("paymentMethod", {
    is: "card_online",
    then: (schema) =>
      schema
        .required("Ім'я власника картки є обов'язковим")
        .matches(/^[A-Za-z\s]+$/, "Ім'я має містити тільки латинські літери")
        .min(3, "Ім'я занадто коротке"),
    otherwise: (schema) => schema.optional(),
  }),
  expiryDate: yup.string().when("paymentMethod", {
    is: "card_online",
    then: (schema) =>
      schema
        .required("Термін дії є обов'язковим")
        .matches(/^\d{2}\/\d{2}$/, "Формат: MM/YY")
        .test(
          "valid-expiry",
          "Картка прострочена або невірна дата",
          isValidExpiryDate
        ),
    otherwise: (schema) => schema.optional(),
  }),
  cvv: yup.string().when("paymentMethod", {
    is: "card_online",
    then: (schema) =>
      schema
        .required("CVV є обов'язковим")
        .matches(/^\d{3}$/, "CVV має містити 3 цифри"),
    otherwise: (schema) => schema.optional(),
  }),
});

type PaymentMethod = "cash" | "card_delivery" | "card_online";
type DeliveryMethod = "novaposhta" | "ukrposhta" | "courier" | "pickup";

interface CheckoutFormData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  comment?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();
  const { items } = useCart();
  const clearCart = useClearCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productsById, setProductsById] = useState<Record<string, Product>>({});

  const normalizeProducts = (data: any): Product[] => {
    if (Array.isArray(data)) return data;
    if (data?.data?.products) return data.data.products;
    if (data?.products) return data.products;
    return [];
  };

  useEffect(() => {
    const ids = Array.from(new Set(items.map((item) => item.productId)));
    if (ids.length === 0) {
      setProductsById({});
      return;
    }

    let isMounted = true;
    const load = async () => {
      const res = await fetchProductsClient({ limit: 500 });
      const list = normalizeProducts(res);
      if (!isMounted) return;
      const map: Record<string, Product> = {};
      list.forEach((product) => {
        if (product?._id && ids.includes(product._id)) {
          map[product._id] = product;
        }
      });
      setProductsById(map);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [items]);

  const cartItems = useMemo(
    () =>
      items
        .map((item) => ({ ...item, product: productsById[item.productId] }))
        .filter((item) => item.product),
    [items, productsById]
  );

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const formik = useFormik<CheckoutFormData>({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: "",
      comment: "",
      deliveryMethod: "novaposhta",
      paymentMethod: "cash",
    },
    validationSchema: baseValidationSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        if (!user) {
          openModal();
          return;
        }

        if (cartItems.length === 0) {
          toast.error("Кошик порожній. Додайте товари перед оформленням.");
          return;
        }

        // Імітація обробки оплати
        if (values.paymentMethod === "card_online") {
          // Тут повинна бути інтеграція з платіжною системою (Stripe, LiqPay, WayForPay тощо)
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Імітація затримки обробки
        }

        const resolvedDeliveryMethod =
          values.deliveryMethod === "courier"
            ? "courier"
            : values.deliveryMethod === "pickup"
            ? "pickup"
            : "post";

        const resolvedPaymentMethod =
          values.paymentMethod === "card_delivery"
            ? "card"
            : values.paymentMethod === "card_online"
            ? "online"
            : "cash";

        const orderPayload: {
          items: Array<{ productId: string; quantity: number }>;
          shippingAddress: {
            name: string;
            phone: string;
            city: string;
            street: string;
            building: string;
          };
          deliveryMethod: "courier" | "pickup" | "post";
          paymentMethod: "cash" | "card" | "online";
          status: "new";
          comment?: string;
          customerName?: string;
          customerPhone?: string;
          customerEmail?: string;
          deliveryAddress?: string;
        } = {
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: buildShippingAddress({
            name: values.name,
            phone: values.phone,
            address: values.address,
          }),
          deliveryMethod: resolvedDeliveryMethod,
          paymentMethod: resolvedPaymentMethod,
          status: "new",
          customerName: values.name,
          customerPhone: values.phone,
          customerEmail: values.email,
          deliveryAddress: values.address,
          ...(values.comment?.trim() ? { comment: values.comment.trim() } : {}),
        };

        const res = await createOrderClient(orderPayload);
        clearCart.mutate();

        if (values.paymentMethod === "card_online") {
          toast.success("Оплата пройшла успішно! Замовлення оформлено.");
        } else {
          toast.success(
            "Замовлення успішно оформлено! Очікуйте на дзвінок менеджера."
          );
        }

        const orderId = res?.data?.order?.id || res?.order?.id || res?.id;
        if (orderId) {
          router.push(`/orders/${orderId}`);
        } else {
          router.push("/");
        }
      } catch (error: any) {
        const details =
          error?.response?.data?.error?.errors?.[0] ||
          error?.response?.data?.error?.message ||
          error?.response?.data?.message;
        toast.error(
          details || "Помилка оформлення замовлення. Спробуйте ще раз."
        );
        console.error("Checkout error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleDeliveryAddressChange = useCallback(
    (city: string, fullAddress: string) => {
      formik.setFieldValue("address", fullAddress);
    },
    [formik]
  );

  if (!user) {
    return (
      <div className="container">
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className={styles.emptyTitle}>Потрібен вхід</h1>
          <p className={styles.emptyText}>Увійдіть, щоб оформити замовлення</p>
          <button onClick={openModal} className={styles.emptyLink}>
            Увійти
          </button>
        </div>
      </div>
    );
  }

  if (items.length > 0 && cartItems.length === 0) {
    return (
      <div className="container">
        <Loader />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className={styles.emptyTitle}>Кошик порожній</h1>
          <p className={styles.emptyText}>
            Додайте товари до кошика перед оформленням замовлення
          </p>
          <a href="/catalog" className={styles.emptyLink}>
            Перейти до каталогу
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Оформлення замовлення</h1>

      <div className={styles.layout}>
        {/* Form */}
        <div>
          <form onSubmit={formik.handleSubmit}>
            {/* Контактна інформація */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Контактна інформація</h2>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Ім'я <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${styles.input} ${
                      formik.touched.name && formik.errors.name
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="Ваше ім'я"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className={styles.error}>{formik.errors.name}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Телефон <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${styles.input} ${
                      formik.touched.phone && formik.errors.phone
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="+380"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className={styles.error}>{formik.errors.phone}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${styles.input} ${
                      formik.touched.email && formik.errors.email
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="your@email.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className={styles.error}>{formik.errors.email}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Адреса доставки <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`${styles.input} ${
                      formik.touched.address && formik.errors.address
                        ? styles.inputError
                        : ""
                    }`}
                    placeholder="Місто, вулиця, будинок, квартира"
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className={styles.error}>{formik.errors.address}</p>
                  )}
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                <label className={styles.label}>Коментар до замовлення</label>
                <textarea
                  name="comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  className={styles.textarea}
                  placeholder="Побажання до замовлення..."
                />
              </div>
            </div>

            {/* Спосіб доставки */}
            <div className={styles.formSection} style={{ marginTop: "1.5rem" }}>
              <h2 className={styles.sectionTitle}>Спосіб доставки</h2>

              <div className={styles.deliveryOptions}>
                <label
                  className={`${styles.deliveryOption} ${
                    formik.values.deliveryMethod === "novaposhta"
                      ? styles.deliveryOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="novaposhta"
                    checked={formik.values.deliveryMethod === "novaposhta"}
                    onChange={formik.handleChange}
                    className={styles.radio}
                  />
                  <div className={styles.deliveryIconWrapper}>
                    <Package className={styles.deliveryIcon} />
                  </div>
                  <div className={styles.deliveryOptionContent}>
                    <div className={styles.deliveryOptionTitle}>Нова Пошта</div>
                    <div className={styles.deliveryOptionDescription}>
                      Доставка 2-4 дні
                    </div>
                  </div>
                  <div className={styles.checkmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label
                  className={`${styles.deliveryOption} ${
                    formik.values.deliveryMethod === "ukrposhta"
                      ? styles.deliveryOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="ukrposhta"
                    checked={formik.values.deliveryMethod === "ukrposhta"}
                    onChange={formik.handleChange}
                    className={styles.radio}
                  />
                  <div className={styles.deliveryIconWrapper}>
                    <Mail className={styles.deliveryIcon} />
                  </div>
                  <div className={styles.deliveryOptionContent}>
                    <div className={styles.deliveryOptionTitle}>Укрпошта</div>
                    <div className={styles.deliveryOptionDescription}>
                      Доставка 3-7 днів
                    </div>
                  </div>
                  <div className={styles.checkmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label
                  className={`${styles.deliveryOption} ${
                    formik.values.deliveryMethod === "courier"
                      ? styles.deliveryOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="courier"
                    checked={formik.values.deliveryMethod === "courier"}
                    onChange={formik.handleChange}
                    className={styles.radio}
                  />
                  <div className={styles.deliveryIconWrapper}>
                    <Truck className={styles.deliveryIcon} />
                  </div>
                  <div className={styles.deliveryOptionContent}>
                    <div className={styles.deliveryOptionTitle}>Кур'єр</div>
                    <div className={styles.deliveryOptionDescription}>
                      Доставка 1-2 дні
                    </div>
                  </div>
                  <div className={styles.checkmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label
                  className={`${styles.deliveryOption} ${
                    formik.values.deliveryMethod === "pickup"
                      ? styles.deliveryOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={formik.values.deliveryMethod === "pickup"}
                    onChange={formik.handleChange}
                    className={styles.radio}
                  />
                  <div className={styles.deliveryIconWrapper}>
                    <Store className={styles.deliveryIcon} />
                  </div>
                  <div className={styles.deliveryOptionContent}>
                    <div className={styles.deliveryOptionTitle}>Самовивіз</div>
                    <div className={styles.deliveryOptionDescription}>
                      Безкоштовно
                    </div>
                  </div>
                  <div className={styles.checkmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>
              </div>
              {formik.touched.deliveryMethod &&
                formik.errors.deliveryMethod && (
                  <p className={styles.error}>{formik.errors.deliveryMethod}</p>
                )}

              {/* Вибір міста та відділення */}
              {formik.values.deliveryMethod &&
                formik.values.deliveryMethod !== "pickup" &&
                formik.values.deliveryMethod !== "courier" && (
                  <div style={{ marginTop: "1rem" }}>
                    <DeliverySelection
                      control={formik as any}
                      errors={formik.errors as any}
                      deliveryMethod={formik.values.deliveryMethod}
                      onAddressChange={handleDeliveryAddressChange}
                    />
                  </div>
                )}
            </div>

            {/* Спосіб оплати */}
            <div className={styles.formSection} style={{ marginTop: "1.5rem" }}>
              <h2 className={styles.sectionTitle}>Спосіб оплати</h2>

              <div className={styles.paymentOptions}>
                <label
                  className={`${styles.paymentOption} ${
                    formik.values.paymentMethod === "cash"
                      ? styles.paymentOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formik.values.paymentMethod === "cash"}
                    onChange={formik.handleChange}
                    className={styles.radioHidden}
                  />
                  <div className={styles.paymentIconWrapper}>
                    <Banknote className={styles.paymentIcon} />
                  </div>
                  <div className={styles.paymentOptionContent}>
                    <div className={styles.paymentOptionTitle}>Готівка</div>
                    <div className={styles.paymentOptionDescription}>
                      При отриманні
                    </div>
                  </div>
                  <div className={styles.paymentCheckmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label
                  className={`${styles.paymentOption} ${
                    formik.values.paymentMethod === "card_delivery"
                      ? styles.paymentOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_delivery"
                    checked={formik.values.paymentMethod === "card_delivery"}
                    onChange={formik.handleChange}
                    className={styles.radioHidden}
                  />
                  <div className={styles.paymentIconWrapper}>
                    <Wallet className={styles.paymentIcon} />
                  </div>
                  <div className={styles.paymentOptionContent}>
                    <div className={styles.paymentOptionTitle}>
                      Накладений платіж
                    </div>
                    <div className={styles.paymentOptionDescription}>
                      У відділенні
                    </div>
                  </div>
                  <div className={styles.paymentCheckmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>

                <label
                  className={`${styles.paymentOption} ${
                    formik.values.paymentMethod === "card_online"
                      ? styles.paymentOptionSelected
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_online"
                    checked={formik.values.paymentMethod === "card_online"}
                    onChange={formik.handleChange}
                    className={styles.radioHidden}
                  />
                  <div className={styles.paymentIconWrapper}>
                    <CreditCard className={styles.paymentIcon} />
                  </div>
                  <div className={styles.paymentOptionContent}>
                    <div className={styles.paymentOptionTitle}>Онлайн</div>
                    <div className={styles.paymentOptionDescription}>
                      Картою
                    </div>
                  </div>
                  <div className={styles.paymentCheckmark}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </label>
              </div>
              {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                <p className={styles.error}>{formik.errors.paymentMethod}</p>
              )}
            </div>

            {/* Card Payment Form */}
            {formik.values.paymentMethod === "card_online" && (
              <div style={{ marginTop: "1.5rem" }}>
                <CardPaymentForm
                  control={formik as any}
                  errors={formik.errors as any}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
              style={{ marginTop: "1.5rem" }}
            >
              {isSubmitting
                ? formik.values.paymentMethod === "card_online"
                  ? "Обробка оплати..."
                  : "Оформлення..."
                : formik.values.paymentMethod === "card_online"
                ? "Оплатити"
                : "Підтвердити замовлення"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Ваше замовлення</h2>

            <div className={styles.summaryItems}>
              {cartItems.map((item) => (
                <div key={item.productId} className={styles.summaryItem}>
                  <img
                    src={item.product?.mainImage}
                    alt={item.product?.name}
                    className={styles.summaryItemImage}
                  />
                  <div className={styles.summaryItemInfo}>
                    <div className={styles.summaryItemName}>
                      {item.product?.name}
                    </div>
                    <div className={styles.summaryItemQuantity}>
                      × {item.quantity}
                    </div>
                  </div>
                  <div className={styles.summaryItemPrice}>
                    {((item.product?.price || 0) * item.quantity).toFixed(2)}{" "}
                    грн
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotal}>
              <span className={styles.summaryTotalLabel}>Разом:</span>
              <span className={styles.summaryTotalValue}>
                {total.toFixed(2)} грн
              </span>
            </div>

            <a href="/catalog" className={styles.continueLink}>
              ← Продовжити покупки
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
