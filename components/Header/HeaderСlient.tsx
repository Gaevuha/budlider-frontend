// app/components/Header/HeaderClient.tsx
"use client";

import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import styles from "./Header.module.css";
import Link from "next/link";

interface HeaderClientProps {
  initialCartItemsCount: number;
  initialFavoritesCount: number;
  initialSearchQuery: string;
}

export function HeaderClient({
  initialCartItemsCount,
  initialFavoritesCount,
  initialSearchQuery,
}: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [cartItemsCount, setCartItemsCount] = useState(initialCartItemsCount);
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user, logout } = useAuth();
  const { openModal, isOpen, closeModal } = useAuthModalStore();

  // Оновлюємо кількість товарів при зміні (реальний час)
  useEffect(() => {
    // Функція для оновлення кількості товарів у кошику
    const updateCartCount = () => {
      if (typeof window !== "undefined") {
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        const count =
          cart.items?.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ) || 0;
        setCartItemsCount(count);
      }
    };

    // Функція для оновлення кількості обраних товарів
    const updateFavoritesCount = () => {
      if (typeof window !== "undefined") {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavoritesCount(favorites.length);
      }
    };

    // Слухаємо зміни в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        updateCartCount();
      }
      if (e.key === "favorites") {
        updateFavoritesCount();
      }
    };

    // Оновлюємо початкові значення при завантаженні
    updateCartCount();
    updateFavoritesCount();

    // Додаємо слухач подій для міжвкладкового спілкування
    window.addEventListener("storage", handleStorageChange);

    // Додаємо слухач для власних подій (якщо зміни відбуваються в цій же вкладці)
    const interval = setInterval(() => {
      updateCartCount();
      updateFavoritesCount();
    }, 1000); // Перевіряємо кожну секунду

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Закриття dropdown меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Автоматичний пошук при введенні
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        // При пошуку очищаємо всі інші фільтри та скидаємо пагінацію
        router.push(
          `/catalog?search=${encodeURIComponent(searchQuery.trim())}`
        );

        // Очищаємо sessionStorage щоб фільтри не відновлювалися
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("catalogFilters");
        }
      }, 500); // Затримка 500мс для debounce

      return () => clearTimeout(timer);
    } else if (searchQuery === "" && typeof window !== "undefined") {
      // Якщо поле порожнє і ми на сторінці каталогу, очищаємо параметр search
      const urlParams = new URLSearchParams(window.location.search);
      const currentPath = window.location.pathname;

      if (currentPath === "/catalog" && urlParams.has("search")) {
        urlParams.delete("search");
        router.push(`/catalog?${urlParams.toString()}`);
      }
    }
  }, [searchQuery, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // При пошуку очищаємо всі інші фільтри та скидаємо пагінацію
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);

      // Очищаємо sessionStorage щоб фільтри не відновлювалися
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("catalogFilters");
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className="container">
        {/* Top bar */}
        <div className={styles.topBar}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoBud}>Буд</span>
            <span className={styles.logoLeader}>лідер</span>
          </Link>

          {/* Search */}
          <div className={styles.searchWrapper}>
            <form onSubmit={handleSearch} className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Пошук товарів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button
                type="submit"
                className={styles.searchButton}
                aria-label="Пошук"
              >
                <Search className={styles.searchIcon} />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Кошик та обране - ЗАВЖДИ доступні (для гостей та авторизованих) */}
            {(!user || user.role !== "admin") && (
              <>
                <Link
                  href="/wishlist"
                  className={styles.actionButton}
                  aria-label="Обране"
                >
                  <Heart className={styles.actionIcon} />
                  {favoritesCount > 0 && (
                    <span className={styles.badge}>{favoritesCount}</span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className={styles.actionButton}
                  aria-label="Кошик"
                >
                  <ShoppingCart className={styles.actionIcon} />
                  {cartItemsCount > 0 && (
                    <span className={styles.badge}>{cartItemsCount}</span>
                  )}
                </Link>
              </>
            )}

            {/* Auth / Profile */}
            {user ? (
              <div className={styles.profileWrapper} ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={styles.profileButton}
                  type="button"
                >
                  <img
                    src={
                      user.avatar ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                    }
                    alt={user.name}
                    className={styles.avatar}
                  />
                  <span className={styles.userName}>{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.profileDropdownHeader}>
                      <p className={styles.profileDropdownName}>{user.name}</p>
                      <p className={styles.profileDropdownEmail}>
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className={styles.profileDropdownItem}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className={styles.profileMenuIcon} />
                      Профіль
                    </Link>
                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/admin/users"
                          className={styles.profileDropdownItem}
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Users className={styles.profileMenuIcon} />
                          Управління користувачами
                        </Link>
                        <Link
                          href="/admin/orders"
                          className={styles.profileDropdownItem}
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className={styles.profileMenuIcon} />
                          Адмін-панель
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className={styles.profileDropdownItem}
                      type="button"
                    >
                      <LogOut className={styles.profileMenuIcon} />
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openModal()}
                className={styles.authButton}
                type="button"
              >
                <User className={styles.actionIcon} />
                <span className={styles.authButtonText}>
                  Увійти / Зареєструватися
                </span>
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(true)}
              className={styles.burgerButton}
              aria-label="Відкрити меню"
              type="button"
            >
              <Menu className={styles.actionIcon} />
            </button>
          </div>
        </div>

        {/* Navigation - Desktop only */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link href="/catalog" className={styles.navLink}>
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/services" className={styles.navLink}>
                Послуги
              </Link>
            </li>
            <li>
              <Link href="/about" className={styles.navLink}>
                Про нас
              </Link>
            </li>
            <li>
              <Link href="/delivery" className={styles.navLink}>
                Доставка
              </Link>
            </li>
            <li>
              <Link href="/contacts" className={styles.navLink}>
                Контакти
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile search */}
        <div className={styles.mobileSearch}>
          <form onSubmit={handleSearch} className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Пошук товарів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Пошук"
            >
              <Search className={styles.searchIcon} />
            </button>
          </form>
        </div>
      </div>

      {/* Burger Menu */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
}
