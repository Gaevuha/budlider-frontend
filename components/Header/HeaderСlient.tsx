// app/components/Header/HeaderClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { Logo } from "@/components/Logo/Logo";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Navigation } from "@/components/Navigation/Navigation";
import { ActionButtons } from "@/components/ActionButtons/ActionButtons";
import { ProfileMenu } from "@/components/ProfileMenu/ProfileMenu";
import styles from "./Header.module.css";

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
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user, logout } = useAuth();
  const { openModal, isOpen, closeModal } = useAuthModalStore();

  // Визначаємо, чи це desktop версія
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeDesktop(window.innerWidth >= 1440);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Оновлюємо кількість товарів при зміні
  useEffect(() => {
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

    const updateFavoritesCount = () => {
      if (typeof window !== "undefined") {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavoritesCount(favorites.length);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        updateCartCount();
      }
      if (e.key === "favorites") {
        updateFavoritesCount();
      }
    };

    updateCartCount();
    updateFavoritesCount();

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      updateCartCount();
      updateFavoritesCount();
    }, 1000);

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
        router.push(
          `/catalog?search=${encodeURIComponent(searchQuery.trim())}`
        );

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("catalogFilters");
        }
      }, 500);

      return () => clearTimeout(timer);
    } else if (searchQuery === "" && typeof window !== "undefined") {
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
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("catalogFilters");
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        {/* Top bar */}
        <div className={styles.topBar}>
          <Logo />

          {/* Desktop Search (показується тільки на планшеті 768px+ та декстопі) */}
          {isLargeDesktop && (
            <div className={styles.desktopSearchWrapper}>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                variant="desktop"
              />
            </div>
          )}

          <div className={styles.actions}>
            <ActionButtons
              user={user}
              cartItemsCount={cartItemsCount}
              favoritesCount={favoritesCount}
            />

            {user ? (
              <ProfileMenu
                user={user}
                isProfileMenuOpen={isProfileMenuOpen}
                setIsProfileMenuOpen={setIsProfileMenuOpen}
                handleLogout={handleLogout}
                profileMenuRef={profileMenuRef}
              />
            ) : (
              isLargeDesktop && (
                <button
                  onClick={() => openModal()}
                  className={styles.authButton}
                  type="button"
                >
                  <span className={styles.authButtonText}>Вхід/Реєстрація</span>
                </button>
              )
            )}

            <button
              onClick={() => setIsMenuOpen(true)}
              className={styles.burgerButton}
              aria-label="Відкрити меню"
              type="button"
            >
              <span className={styles.burgerIcon}>☰</span>
            </button>
          </div>
        </div>

        <Navigation />

        {/* Mobile Search (показується тільки на мобільних до 768px) */}
        {!isLargeDesktop && (
          <div className={styles.mobileSearchWrapper}>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              variant="mobile"
            />
          </div>
        )}
      </div>

      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
}
