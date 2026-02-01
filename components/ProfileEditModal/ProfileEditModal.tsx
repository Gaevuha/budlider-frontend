"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X, Camera } from "lucide-react";
import ModalWrapper from "@/components/ui/modalwrapper/ModalWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/lib/utils/toast";
import styles from "./ProfileEditModal.module.css";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Maybe<T> = T | undefined | null;

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
}

const schema = yup.object({
  name: yup.string().required("Обов'язкове поле"),
  email: yup.string().required("Обов'язкове поле").email("Невірний email"),
  phone: yup.string().default(""),
  avatar: yup.string().default(""),
  address: yup.string().default(""),
});
export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, updateProfile } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
      address: user?.address ?? "",
    },
  });

  useEffect(() => {
    if (!isOpen || !user) return;
    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      avatar: user.avatar ?? "",
      address: user.address ?? "",
    });
    setAvatarPreview(user.avatar || "");
  }, [isOpen, reset, user]);

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    updateProfile({
      ...data,
      phone: data.phone || undefined,
      avatar: data.avatar || undefined,
      address: data.address || undefined,
    });
    reset(data);
    setAvatarPreview(data.avatar || "");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Невірний формат");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      setValue("avatar", base64);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className={styles.profileHeader}>
        <h2 className={styles.profileTitle}>Редагувати профіль</h2>
        <button className={styles.profileCloseButton} onClick={onClose}>
          <X />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.avatarSection}>
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt={user.name}
              className={styles.avatar}
            />
          )}
          <button
            type="button"
            className={styles.changeAvatarButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <input
          {...register("name")}
          placeholder="Ім'я"
          className={styles.input}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        <input
          {...register("email")}
          placeholder="Email"
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <input
          {...register("phone")}
          placeholder="Телефон"
          className={styles.input}
        />
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}

        <textarea
          {...register("address")}
          placeholder="Адреса"
          className={styles.textarea}
        />

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            Скасувати
          </button>
          <button type="submit" className={styles.saveButton}>
            Зберегти
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
