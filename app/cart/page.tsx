"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { mockProducts } from "@/data/mockData";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/lib/hooks/useCart";
import styles from "./CartPage.module.css";

export default function CartPage() {
  // ✅ Нові хуки замість Zustand store
  const { items } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();

  const cartItems = items
    .map((item) => {
      const product = mockProducts.find((p) => p._id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className={styles.emptyTitle}>Ваш кошик порожній</h1>
        <p className={styles.emptyText}>
          Додайте товари до кошика, щоб оформити замовлення
        </p>
        <Link href="/catalog" className={styles.emptyLink}>
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Кошик</h1>

      <div className={styles.itemsList}>
        {cartItems.map((item) => {
          const product = item.product!;
          return (
            <div key={item.productId} className={styles.cartItem}>
              <div className={styles.itemContent}>
                {/* Image */}
                <div className={styles.itemImage}>
                  <Link
                    href={`/product/${product.slug}`}
                    className={styles.itemImageLink}
                  >
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className={styles.image}
                    />
                  </Link>
                </div>

                {/* Info */}
                <div className={styles.itemInfo}>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className={styles.itemName}>{product.name}</h3>
                  </Link>
                  <p className={styles.itemBrand}>{product.brand}</p>
                  <p className={styles.itemPrice}>{product.price} грн</p>
                </div>

                {/* Quantity controls */}
                <div className={styles.itemActions}>
                  <button
                    onClick={() => removeFromCart.mutate(item.productId)}
                    className={styles.removeButton}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className={styles.quantityControls}>
                    <button
                      onClick={() =>
                        updateQuantity.mutate({
                          productId: item.productId,
                          quantity: item.quantity - 1,
                        })
                      }
                      disabled={item.quantity <= 1}
                      className={styles.quantityButton}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity.mutate({
                          productId: item.productId,
                          quantity: item.quantity + 1,
                        })
                      }
                      className={styles.quantityButton}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className={styles.itemTotal}>
                    {(product.price * item.quantity).toFixed(2)} грн
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Разом:</span>
          <span className={styles.summaryTotal}>{total.toFixed(2)} грн</span>
        </div>
        <button
          onClick={() => {
            if (user) {
              router.push("/checkout");
            } else {
              openModal();
            }
          }}
          className={styles.checkoutButton}
        >
          Оформити замовлення
        </button>
        <Link href="/catalog" className={styles.continueLink}>
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}
