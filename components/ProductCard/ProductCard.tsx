'use client';

import { Heart, ShoppingCart, Eye, Zap, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { AvailabilityBadge } from '@/components/AvailabilityBadge/AvailabilityBadge';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  isInCart?: boolean;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onQuickOrder?: (productId: string) => void;
}

export function ProductCard({ product, isFavorite, isInCart = false, onAddToCart, onToggleFavorite, onQuickOrder }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.link}>
        {/* Image */}
        <div className={styles.imageContainer}>
          <img
            src={product.mainImage}
            alt={product.name}
            className={styles.image}
          />
          {product.isNewProduct && (
            <span className={styles.badgeNew}>
              Новинка
            </span>
          )}
          {product.oldPrice && (
            <span className={styles.badgeSale}>
              Акція
            </span>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          
          {/* Category and Brand */}
          <div className={styles.tags}>
            <span className={styles.categoryTag}>{product.category.name}</span>
            <span className={styles.brandTag}>{product.brand}</span>
          </div>

          {/* Rating */}
          <div className={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < product.rating ? styles.starFilled : styles.starEmpty}>
                ★
              </span>
            ))}
          </div>

          {/* Price */}
          <div className={styles.priceContainer}>
            <span className={styles.price}>{product.price} грн</span>
            {product.oldPrice && (
              <>
                <span className={styles.oldPrice}>{product.oldPrice} грн</span>
                <span className={styles.discount}>
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Stock status */}
          <AvailabilityBadge 
            availability={product.availability}
            stock={product.stock}
            size="small"
            showStock={true}
          />
        </div>
      </Link>

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.mainActions}>
          <button
            onClick={() => onAddToCart(product._id)}
            disabled={product.availability === 'out_of_stock' && !isInCart}
            className={`${styles.addToCartButton} ${isInCart ? styles.removeFromCartButton : ''}`}
          >
            {isInCart ? (
              <>
                <Trash2 className={styles.buttonIcon} />
                <span>Видалити з кошика</span>
              </>
            ) : (
              <>
                <ShoppingCart className={styles.buttonIcon} />
                <span>{product.availability === 'pre_order' ? 'Замовити' : 'В кошик'}</span>
              </>
            )}
          </button>
          <button
            onClick={() => onToggleFavorite(product._id)}
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
          >
            <Heart className={`${styles.favoriteIcon} ${isFavorite ? styles.favoriteIconFilled : ''}`} />
          </button>
        </div>
        {onQuickOrder && (
          <button
            onClick={() => onQuickOrder(product._id)}
            disabled={product.availability === 'out_of_stock'}
            className={styles.quickOrderButton}
          >
            <Zap className={styles.buttonIcon} />
            <span>Швидке замовлення</span>
          </button>
        )}
      </div>
    </div>
  );
}