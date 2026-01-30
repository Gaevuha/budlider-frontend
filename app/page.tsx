"use client";

import { useState } from "react";
import Link from "next/link";
import { mockProducts } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { QuickOrderModal } from "@/components/QuickOrderModal/QuickOrderModal";
import { Hero } from "@/components/Hero/Hero";
import { Product } from "@/types";
import { useCart, useAddToCart, useRemoveFromCart } from "@/lib/hooks/useCart";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/useWishlist";
import { Package, Truck, Shield, Phone, ArrowRight } from "lucide-react";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const newProducts = mockProducts.filter((p) => p.isNewProduct).slice(0, 4);
  const saleProducts = mockProducts.filter((p) => p.oldPrice).slice(0, 4);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(
    null
  );

  // ✅ Нові хуки замість Zustand stores
  const { items: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const { favorites } = useWishlist();
  const toggleWishlist = useToggleWishlist();

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
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <Package className={styles.featureIcon} />
              <h3>Якісна продукція</h3>
              <p>Тільки перевірені бренди</p>
            </div>
            <div className={styles.featureCard}>
              <Truck className={styles.featureIcon} />
              <h3>Швидка доставка</h3>
              <p>По всій Україні</p>
            </div>
            <div className={styles.featureCard}>
              <Shield className={styles.featureIcon} />
              <h3>Гарантія якості</h3>
              <p>На всі товари</p>
            </div>
            <div className={styles.featureCard}>
              <Phone className={styles.featureIcon} />
              <h3>Підтримка 24/7</h3>
              <p>Завжди на зв'язку</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className={styles.productsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Новинки</h2>
              <Link href="/catalog?isNew=true" className={styles.viewAllLink}>
                Дивитись всі <ArrowRight />
              </Link>
            </div>
            <div className={styles.productsGrid}>
              {newProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorite={favorites.includes(product._id)}
                  isInCart={cartItems.some(
                    (item) => item.productId === product._id
                  )}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  onQuickOrder={handleQuickOrder}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className={styles.productsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Акційні товари</h2>
              <Link href="/catalog?onSale=true" className={styles.viewAllLink}>
                Дивитись всі <ArrowRight />
              </Link>
            </div>
            <div className={styles.productsGrid}>
              {saleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorite={favorites.includes(product._id)}
                  isInCart={cartItems.some(
                    (item) => item.productId === product._id
                  )}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  onQuickOrder={handleQuickOrder}
                />
              ))}
            </div>
          </div>
        </section>
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
