'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import styles from './BurgerMenu.module.css';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Головна' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/services', label: 'Послуги' },
  { to: '/about', label: 'Про нас' },
  { to: '/delivery', label: 'Доставка' },
  { to: '/contacts', label: 'Контакти' },
];

export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  // Блокування скролу body при відкритті меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.backdrop}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            className={styles.menu}
          >
            {/* Header */}
            <motion.div 
              className={styles.header}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h2 className={styles.title}>Меню</h2>
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Закрити меню"
              >
                <X className={styles.closeIcon} />
              </button>
            </motion.div>

            {/* Navigation */}
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.1 + index * 0.05, 
                      duration: 0.3,
                      type: 'spring',
                      stiffness: 300,
                      damping: 24
                    }}
                  >
                    <Link
                      href={item.to}
                      className={styles.navLink}
                      onClick={onClose}
                    >
                      <span className={styles.navLinkText}>{item.label}</span>
                      <motion.div
                        className={styles.navLinkIndicator}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Contact Info */}
            <motion.div 
              className={styles.contactInfo}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className={styles.contactTitle}>Контакти</h3>
              <p className={styles.contactText}>
                Телефон: <a href="tel:+380XXXXXXXXX" className={styles.contactLink}>+380 XX XXX XX XX</a>
              </p>
              <p className={styles.contactText}>
                Email: <a href="mailto:info@buildleader.ua" className={styles.contactLink}>info@buildleader.ua</a>
              </p>
              <div className={styles.schedule}>
                <p className={styles.scheduleTitle}>Графік роботи:</p>
                <p className={styles.scheduleText}>Пн-Пт: 8:00 - 18:00</p>
                <p className={styles.scheduleText}>Сб: 9:00 - 16:00</p>
                <p className={styles.scheduleText}>Нд: вихідний</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}