import * as yup from "yup";

export interface QuickOrderFormData {
  name: string;
  phone: string;
  comment?: string;
}

export const quickOrderSchema = yup.object().shape({
  name: yup
    .string()
    .required("Ім'я є обов'язковим")
    .min(2, "Ім'я має містити мінімум 2 символи")
    .max(50, "Ім'я має містити максимум 50 символів"),
  phone: yup
    .string()
    .required("Телефон є обов'язковим")
    .matches(
      /^(\+38)?0\d{9}$/,
      "Введіть коректний номер телефону (наприклад, +380501234567 або 0501234567)"
    ),
  comment: yup
    .string()
    .max(500, "Коментар має містити максимум 500 символів")
    .optional(),
});
