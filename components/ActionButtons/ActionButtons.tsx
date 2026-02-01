import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import styles from "./ActionButtons.module.css";

interface ActionButtonsProps {
  user: any;
  cartItemsCount: number;
  favoritesCount: number;
}

export function ActionButtons({
  user,
  cartItemsCount,
  favoritesCount,
}: ActionButtonsProps) {
  if (user?.role === "admin") return null;

  return (
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
      <Link href="/cart" className={styles.actionButton} aria-label="Кошик">
        <ShoppingCart className={styles.actionIcon} />
        {cartItemsCount > 0 && (
          <span className={styles.badge}>{cartItemsCount}</span>
        )}
      </Link>
    </>
  );
}
