"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Heart,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Edit2,
  Users,
} from "lucide-react";
import { ProfileEditModal } from "@/components/ProfileEditModal/ProfileEditModal";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { items: cartItems } = useCart();
  const { favorites } = useWishlist();

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const favoritesCount = favorites.length;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.notAuthorized}>
          <h1 className={styles.notAuthorizedTitle}>Необхідна авторизація</h1>
          <p className={styles.notAuthorizedText}>
            Увійдіть в акаунт щоб переглянути профіль
          </p>
          <button
            onClick={() => router.push("/")}
            className={styles.notAuthorizedButton}
          >
            На головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Особистий кабінет</h1>

      {/* User Info */}
      <div className={styles.userCard}>
        <div className={styles.userCardHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={styles.avatar}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const placeholder =
                      e.currentTarget.parentElement?.querySelector(
                        `.${styles.avatarPlaceholder}`
                      );
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className={styles.avatarPlaceholder}
                style={{ display: user.avatar ? "none" : "flex" }}
              >
                <User className={styles.icon} />
              </div>
            </div>
            <div>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <div className={styles.userActions}>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className={styles.editButton}
              aria-label="Редагувати профіль"
            >
              <Edit2 className={styles.icon} />
              <span>Редагувати</span>
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <LogOut className={styles.icon} />
              <span>Вийти</span>
            </button>
          </div>
        </div>

        <div className={styles.userDetailsGrid}>
          <div className={styles.userDetail}>
            <p className={styles.userDetailLabel}>Телефон</p>
            <p className={styles.userDetailValue}>
              {user.phone || "Не вказано"}
            </p>
          </div>
          <div className={styles.userDetail}>
            <p className={styles.userDetailLabel}>Роль</p>
            <p className={styles.userDetailValue}>
              {user.role === "admin" ? "Адміністратор" : "Користувач"}
            </p>
          </div>
          {user.address && (
            <div className={styles.userDetail} style={{ gridColumn: "1 / -1" }}>
              <p className={styles.userDetailLabel}>Адреса</p>
              <p className={styles.userDetailValue}>{user.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        {user.role !== "admin" && (
          <>
            <button
              onClick={() => router.push("/wishlist")}
              className={styles.quickLink}
            >
              <Heart className={styles.quickLinkIcon} />
              <h3 className={styles.quickLinkTitle}>Обране</h3>
              <p className={styles.quickLinkDescription}>
                Список улюблених товарів
              </p>
              {favoritesCount > 0 && (
                <div className={styles.badge}>{favoritesCount}</div>
              )}
            </button>

            <button
              onClick={() => router.push("/cart")}
              className={styles.quickLink}
            >
              <ShoppingCart className={styles.quickLinkIcon} />
              <h3 className={styles.quickLinkTitle}>Кошик</h3>
              <p className={styles.quickLinkDescription}>
                Товари до замовлення
              </p>
              {cartItemsCount > 0 && (
                <div className={styles.badge}>{cartItemsCount}</div>
              )}
            </button>
          </>
        )}

        {user.role === "admin" && (
          <>
            <button
              onClick={() => router.push("/admin/orders")}
              className={styles.quickLink}
            >
              <Settings className={styles.quickLinkIcon} />
              <h3 className={styles.quickLinkTitle}>Управління замовленнями</h3>
              <p className={styles.quickLinkDescription}>
                Перегляд та обробка замовлень
              </p>
            </button>

            <button
              onClick={() => router.push("/admin/users")}
              className={styles.quickLink}
            >
              <Users className={styles.quickLinkIcon} />
              <h3 className={styles.quickLinkTitle}>
                Управління користувачами
              </h3>
              <p className={styles.quickLinkDescription}>
                Перегляд та редагування користувачів
              </p>
            </button>
          </>
        )}
      </div>

      {/* Orders History - optional section */}
      <div className={styles.ordersCard}>
        <h2 className={styles.ordersTitle}>Історія замовлень</h2>
        <div className={styles.emptyOrders}>
          <Package className={styles.emptyOrdersIcon} />
          <p className={styles.emptyOrdersText}>У вас ще немає замовлень</p>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
