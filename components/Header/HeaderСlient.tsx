// app/components/Header/HeaderClient.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { Logo } from "@/components/Logo/Logo";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Navigation } from "@/components/Navigation/Navigation";
import { ActionButtons } from "@/components/ActionButtons/ActionButtons";
import { ProfileMenu } from "@/components/ProfileMenu/ProfileMenu";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
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
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const { user, logout } = useAuth();
  const { openModal, isOpen, closeModal } = useAuthModalStore();
  const { items: cartItems } = useCart();
  const { favorites } = useWishlist();

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

  useEffect(() => {
    if (isLargeDesktop) {
      setIsMenuOpen(false);
    }
  }, [isLargeDesktop]);

  // Позначаємо гідратацію, щоб використовувати актуальні значення зі store
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const derivedCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const cartItemsCount = hasHydrated ? derivedCartCount : initialCartItemsCount;
  const favoritesCount = hasHydrated ? favorites.length : initialFavoritesCount;

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setIsProfileMenuOpen(false);
    }
  }, [pathname]);

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
