"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/utils/toast";
import { Portal } from "@/components/ui/portal/Portal";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

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

  const handleGoogleAuth = () => {
    // Симуляція Google авторизації
    toast.info(
      "Google авторизація буде доступна після інтеграції з Google OAuth"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      onClose();
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася пмилка");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

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
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.tabs}>
                  <button
                    type="button"
                    className={`${styles.tab} ${
                      mode === "login" ? styles.tabActive : ""
                    }`}
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setFormData({ name: "", email: "", password: "" });
                    }}
                  >
                    Вхід
                  </button>
                  <button
                    type="button"
                    className={`${styles.tab} ${
                      mode === "register" ? styles.tabActive : ""
                    }`}
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setFormData({ name: "", email: "", password: "" });
                    }}
                  >
                    Реєстрація
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className={styles.closeButton}
                  aria-label="Закрити"
                >
                  <X className={styles.closeIcon} />
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

              {/* Form */}
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className={styles.googleButton}
                >
                  <svg className={styles.googleIcon} viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {mode === "login"
                    ? "Увійти через Google"
                    : "Зареєструватися через Google"}
                </button>

                <div className={styles.divider}>
                  <span className={styles.dividerLine}></span>
                  <span className={styles.dividerText}>або</span>
                  <span className={styles.dividerLine}></span>
                </div>

                {mode === "register" && (
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Ім'я <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="Введіть ваше ім'я"
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="your@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Пароль <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className={styles.input}
                    placeholder="Мінімум 6 символів"
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
