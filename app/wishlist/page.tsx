"use client";

import { useState } from "react";
import { mockProducts } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { QuickOrderModal } from "@/components/QuickOrderModal/QuickOrderModal";
import { Product } from "@/types";
import { useCart, useAddToCart, useRemoveFromCart } from "@/lib/hooks/useCart";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/useWishlist";
import { Heart } from "lucide-react";
import styles from "./WishlistPage.module.css";

export default function WishlistPage() {
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(
    null
  );

  // ✅ Нові хуки замість Zustand stores
  const { favorites } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const { items: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  const favoriteProducts = mockProducts.filter((product) =>
    favorites.includes(product._id)
  );

  const handleQuickOrder = (productId: string) => {
    const product = mockProducts.find((p) => p._id === productId);
    if (product) {
      setQuickOrderProduct(product);
    }
  };

  // ✅ Обробник кошика - працює для ВСІХ користувачів
  const handleAddToCart = (productId: string) => {
    const isInCart = cartItems.some((item) => item.productId === productId);

    if (isInCart) {
      removeFromCart.mutate(productId);
    } else {
      addToCart.mutate({ productId, quantity: 1 });
    }
  };

  // ✅ Обробник обраного - працює для ВСІХ користувачів
  const handleToggleFavorite = (productId: string) => {
    toggleWishlist.mutate(productId);
  };

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Обране</h1>
        <p className={styles.description}>
          {favoriteProducts.length > 0
            ? `У вашому списку ${favoriteProducts.length} ${
                favoriteProducts.length === 1
                  ? "товар"
                  : favoriteProducts.length < 5
                  ? "товари"
                  : "товарів"
              }`
            : "Ви ще не додали жодного товару в обране"}
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Heart className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Список обраного порожній</h2>
          <p className={styles.emptyText}>
            Додайте товари, які вам сподобались, натиснувши на іконку серця
          </p>
          <a href="/catalog" className={styles.emptyLink}>
            Перейти до каталогу
          </a>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isFavorite={true}
              isInCart={cartItems.some(
                (item) => item.productId === product._id
              )}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onQuickOrder={handleQuickOrder}
            />
          ))}
        </div>
      )}

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={quickOrderProduct !== null}
        product={quickOrderProduct}
        onClose={() => setQuickOrderProduct(null)}
      />
    </div>
  );
}
