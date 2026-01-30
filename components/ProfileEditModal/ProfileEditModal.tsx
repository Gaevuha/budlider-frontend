'use client';

import { toast } from '@/utils/toast';
import { Portal } from '@/components/ui/portal/Portal';
import styles from './ProfileEditModal.module.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
}

const profileValidationSchema = yup.object().shape({
  name: yup.string().required("Ім'я обов'язкове").min(2, "Ім'я має містити мінімум 2 символи"),
  email: yup.string().required("Email обов'язковий").email('Невірний формат email'),
  phone: yup.string().matches(/^\+?3?8?(0\d{9})$/, 'Невірний формат телефону'),
  avatar: yup.string(),
  address: yup.string(),
});

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, updateProfile } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
      address: user?.address || '',
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      try {
        updateProfile(values);
        setAvatarPreview(values.avatar);
        onClose();
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast.error('Не вдалося оновити профіль');
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Перевірка розміру (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл занадто великий. Максимальний розмір 5MB');
      return;
    }

    // Перевірка типу
    if (!file.type.startsWith('image/')) {
      toast.error('Будь ласка, оберіть файл зображення');
      return;
    }

    // Конвертація в base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
      formik.setFieldValue('avatar', base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    formik.resetForm();
    setAvatarPreview(user?.avatar || '');
    onClose();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <div className={styles.overlay} onClick={handleClose}>
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.header}>
                <h2 className={styles.title}>Редагувати профіль</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className={styles.closeButton}
                  aria-label="Закрити"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0 }}>
                <div className={styles.content}>
                  {/* Avatar Section */}
                  <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt={user.name}
                          className={styles.avatar}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <span className={styles.avatarLetter}>
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={styles.changeAvatarButton}
                        aria-label="Змінити аватар"
                      >
                        <Camera size={20} />
                      </button>
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className={styles.fileInput}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>

                  {/* Form Fields */}
                  <div className={styles.form}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name" className={styles.label}>
                        Ім'я <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={styles.input}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <span className={styles.error}>{formik.errors.name}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.label}>
                        Email <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={styles.input}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <span className={styles.error}>{formik.errors.email}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone" className={styles.label}>
                        Телефон
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="+380501234567"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={styles.input}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <span className={styles.error}>{formik.errors.phone}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="address" className={styles.label}>
                        Адреса
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        placeholder="Місто, вулиця, будинок, квартира"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                </div>

                {/* FOOTER WITH BUTTONS */}
                <div className={styles.footer}>
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`${styles.button} ${styles.cancelButton}`}
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className={`${styles.button} ${styles.saveButton}`}
                  >
                    {formik.isSubmitting ? 'Збереження...' : 'Зберегти'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}