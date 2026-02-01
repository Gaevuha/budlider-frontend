"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalWrapper.module.css";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string; // додатковий клас для специфічного контенту
}

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalWrapperProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`${styles.modal} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
