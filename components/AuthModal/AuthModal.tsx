"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/utils/toast";
import ModalWrapper from "@/components/ui/modalwrapper/ModalWrapper";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

const schemaLogin = yup.object({
  email: yup.string().required("Обов'язкове поле").email("Невірний email"),
  password: yup
    .string()
    .required("Обов'язкове поле")
    .min(6, "Мінімум 6 символів"),
});

const schemaRegister = yup.object({
  name: yup.string().required("Обов'язкове поле").min(2),
  email: yup.string().required("Обов'язкове поле").email("Невірний email"),
  password: yup
    .string()
    .required("Обов'язкове поле")
    .min(6, "Мінімум 6 символів"),
});

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login, register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: yupResolver(mode === "login" ? schemaLogin : schemaRegister),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    setLoading(true);
    try {
      if (mode === "login") await login(data.email, data.password);
      else await registerUser(data.name!, data.email, data.password);
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.info(
      "Google авторизація буде доступна після інтеграції з Google OAuth"
    );
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === "login" ? styles.tabActive : ""
            }`}
            onClick={() => setMode("login")}
          >
            Вхід
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              mode === "register" ? styles.tabActive : ""
            }`}
            onClick={() => setMode("register")}
          >
            Реєстрація
          </button>
        </div>

        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Закрити"
        >
          <X />
        </button>
      </div>

      {/* Demo Credentials */}
      {mode === "login" && (
        <div className={styles.demoCredentials}>
          <p className={styles.demoTitle}>Демо облікові записи:</p>
          <p className={styles.demoItem}>
            <strong>Адмін:</strong> admin@budlider.com / admin123
          </p>
          <p className={styles.demoItem}>
            <strong>Користувач:</strong> user@example.com / user123
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          type="button"
          onClick={handleGoogleAuth}
          className={styles.googleButton}
        >
          {mode === "login"
            ? "Увійти через Google"
            : "Зареєструватися через Google"}
        </button>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerText}>або</div>
          <div className={styles.dividerLine} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {mode === "register" && (
            <>
              <label className={styles.label}>
                Ім'я <span className={styles.required}>*</span>
              </label>
              <input
                {...register("name")}
                placeholder="Введіть ваше ім'я"
                className={styles.input}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </>
          )}

          <label className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            {...register("email")}
            placeholder="your@email.com"
            className={styles.input}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          <label className={styles.label}>
            Пароль <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Мінімум 6 символів"
            className={styles.input}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading
              ? "Завантаження..."
              : mode === "login"
              ? "Увійти"
              : "Зареєструватися"}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}
