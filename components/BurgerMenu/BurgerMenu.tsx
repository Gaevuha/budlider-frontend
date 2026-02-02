"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthModalStore } from "@/store/authModalStore";
import styles from "./BurgerMenu.module.css";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/", label: "Головна" },
  { to: "/catalog", label: "Каталог" },
  { to: "/services", label: "Послуги" },
  { to: "/about", label: "Про нас" },
  { to: "/delivery", label: "Доставка" },
  { to: "/contacts", label: "Контакти" },
];

export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const { openModal } = useAuthModalStore();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className={styles.menu}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <h2 className={styles.title}>Меню</h2>
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Закрити меню"
              >
                <X className={styles.closeIcon} />
              </button>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {navItems.map((item, index) => {
                  const active = isActive(item.to);

                  return (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.05,
                        duration: 0.3,
                      }}
                    >
                      <Link
                        href={item.to}
                        onClick={onClose}
                        className={`${styles.navLink} ${
                          active ? styles.activeNavLink : ""
                        }`}
                      >
                        <span className={styles.navLinkText}>{item.label}</span>

                        <motion.div
                          className={styles.navLinkIndicator}
                          animate={{ width: active ? "100%" : "0%" }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.25 }}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Auth */}
            <div className={styles.authWrapper}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openModal();
                }}
                className={styles.authButtonMobile}
              >
                Вхід / Реєстрація
              </button>
            </div>

            {/* Contact Info */}
            <motion.div
              className={styles.contactInfo}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className={styles.contactTitle}>Контакти</h3>

              <p className={styles.contactText}>
                Телефон:{" "}
                <a href="tel:+380XXXXXXXXX" className={styles.contactLink}>
                  +380 XX XXX XX XX
                </a>
              </p>

              <p className={styles.contactText}>
                Email:{" "}
                <a
                  href="mailto:info@buildleader.ua"
                  className={styles.contactLink}
                >
                  info@buildleader.ua
                </a>
              </p>

              <div className={styles.schedule}>
                <p className={styles.scheduleTitle}>Графік роботи:</p>
                <p className={styles.scheduleText}>Пн–Пт: 8:00 – 18:00</p>
                <p className={styles.scheduleText}>Сб: 9:00 – 16:00</p>
                <p className={styles.scheduleText}>Нд: вихідний</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
