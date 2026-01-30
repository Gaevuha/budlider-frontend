'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { User } from '@/types';
import type { UpdateUserData } from '@/api/users';
import styles from './UserEditModal.module.css';

interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserData) => void;
  isLoading?: boolean;
}

const schema = yup.object({
  name: yup.string().required("Ім'я обов'язкове"),
  email: yup.string().email('Некоректний email').required("Email обов'язковий"),
  phone: yup.string(),
  address: yup.string(),
  role: yup.string().oneOf(['user', 'admin']).required("Роль обов'язкова"),
}).required();

type FormData = yup.InferType<typeof schema>;

export function UserEditModal({ user, isOpen, onClose, onSubmit, isLoading }: UserEditModalProps) {
  const formik = useFormik<FormData>({
    initialValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
    },
    validationSchema: schema,
    onSubmit: (data) => {
      const updateData: UpdateUserData = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        address: data.address || undefined,
        role: data.role as 'user' | 'admin',
      };
      onSubmit(updateData);
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          role: user.role,
        },
      });
    }
  }, [isOpen, user, formik]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Редагувати користувача</h2>
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Закрити"
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div className={styles.body}>
              <form onSubmit={formik.handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Ім'я <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                    className={`${styles.input} ${formik.touched.name && formik.errors.name ? styles.error : ''}`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className={styles.errorText}>{formik.errors.name}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                    className={`${styles.input} ${formik.touched.email && formik.errors.email ? styles.error : ''}`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className={styles.errorText}>{formik.errors.email}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Телефон
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...formik.getFieldProps('phone')}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.label}>
                    Адреса
                  </label>
                  <input
                    id="address"
                    type="text"
                    {...formik.getFieldProps('address')}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="role" className={styles.label}>
                    Роль <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="role"
                    {...formik.getFieldProps('role')}
                    className={styles.select}
                  >
                    <option value="user">Користувач</option>
                    <option value="admin">Адміністратор</option>
                  </select>
                </div>
              </form>
            </div>

            <div className={styles.footer}>
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Збереження...' : 'Зберегти зміни'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Скасувати
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}