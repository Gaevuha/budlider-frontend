"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
} from "@/lib/hooks/useCart";
import { fetchProductsClient } from "@/lib/api/apiClient";
import { Loader } from "@/components/ui/loader/Loader";
import type { Product } from "@/types";
import styles from "./CartPage.module.css";
import Image from "next/image";

export default function CartPage() {
  // ✅ Нові хуки замість Zustand store
  const { items } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const router = useRouter();
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();

  const [productsById, setProductsById] = useState<Record<string, Product>>({});

  const normalizeProducts = (data: any): Product[] => {
    if (Array.isArray(data)) return data;
    if (data?.data?.products) return data.data.products;
    if (data?.products) return data.products;
    return [];
  };

  useEffect(() => {
    const ids = Array.from(new Set(items.map((item) => item.productId)));
    if (ids.length === 0) {
      setProductsById({});
      return;
    }

    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetchProductsClient({ limit: 500 });
        const list = normalizeProducts(res);
        if (!isMounted) return;
        const map: Record<string, Product> = {};
        list.forEach((product) => {
          if (product?._id && ids.includes(product._id)) {
            map[product._id] = product;
          }
        });
        setProductsById(map);
      } finally {
        // no-op
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [items]);

  const cartItems = useMemo(
    () =>
      items
        .map((item) => ({ ...item, product: productsById[item.productId] }))
        .filter((item) => item.product),
    [items, productsById]
  );

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  if (items.length > 0 && cartItems.length === 0) {
    return (
      <div className={`${styles.container} ${styles.loaderContainer}`}>
        <Loader />
      </div>
    );
  }

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
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      className={styles.image}
                      width={80}
                      height={80}
                    />
                  </Link>
                </div>

                {/* Info */}
                <div className={styles.itemInfo}>
                  <Link
                    href={`/product/${product.slug}`}
                    className={styles.itemLink}
                  >
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
