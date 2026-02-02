"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { Product } from "@/types";
import { useCart, useAddToCart, useRemoveFromCart } from "@/lib/hooks/useCart";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/useWishlist";
import { fetchProductsClient, fetchProductClient } from "@/lib/api/apiClient";
import { AvailabilityBadge } from "@/components/AvailabilityBadge/AvailabilityBadge";
import { ReviewForm } from "@/components/ReviewForm/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList/ReviewsList";
import styles from "./ProductDetailPage.module.css";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { items: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  const { favorites } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeProducts = (data: any): Product[] => {
    if (Array.isArray(data)) return data;
    if (data?.data?.products) return data.data.products;
    if (data?.products) return data.products;
    return [];
  };

  const normalizeProduct = (data: any): Product | null => {
    if (!data) return null;
    if (data?.data) return data.data;
    return data;
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const listRes = await fetchProductsClient({ slug });
        let found: Product | null = normalizeProducts(listRes)[0] || null;
        if (!found) {
          try {
            const res = await fetchProductClient(slug);
            found = normalizeProduct(res);
          } catch {
            found = null;
          }
        }

        if (!isMounted) return;
        setProduct(found);
      } catch {
        if (!isMounted) return;
        setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?.category?.slug) {
      setRelatedProducts([]);
      return;
    }

    let isMounted = true;
    const loadRelated = async () => {
      try {
        const res = await fetchProductsClient({
          categories: [product.category.slug],
          limit: 4,
        });
        const related = normalizeProducts(res).filter(
          (p) => p._id !== product._id
        );
        if (!isMounted) return;
        setRelatedProducts(related.slice(0, 4));
      } catch {
        if (!isMounted) return;
        setRelatedProducts([]);
      }
    };

    loadRelated();
    return () => {
      isMounted = false;
    };
  }, [product?.category?.slug, product?._id]);

  const images = useMemo(
    () =>
      product ? [product.mainImage, product.mainImage, product.mainImage] : [],
    [product?.mainImage]
  );

  if (!product && !isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Товар не знайдено</h1>
          <p className={styles.notFoundText}>
            На жаль, товар з такою адресою не існує
          </p>
          <Link href="/catalog" className={styles.notFoundLink}>
            Перейти до каталогу
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isInCart = cartItems.some((item) => item.productId === product._id);
  const isFavorite = favorites.includes(product._id);

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart.mutate(product._id);
    } else {
      addToCart.mutate({ productId: product._id, quantity });
    }
  };

  const handleToggleFavorite = () => {
    toggleWishlist.mutate(product._id);
  };

  const relatedProductsList = relatedProducts;

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>
          Головна
        </Link>
        <span>/</span>
        <Link href="/catalog" className={styles.breadcrumbLink}>
          Каталог
        </Link>
        <span>/</span>
        <Link
          href={`/catalog?category=${product.category.slug}`}
          className={styles.breadcrumbLink}
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      {/* Back button */}
      <button onClick={() => router.back()} className={styles.backButton}>
        <ArrowLeft className={styles.icon} />
        <span>Назад</span>
      </button>

      <div className={styles.productLayout}>
        {/* Images */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <Image
              src={images[selectedImage]}
              alt={product.name}
              className={styles.mainImageImg}
              width={400}
              height={400}
              priority
            />
          </div>
          <div className={styles.thumbnails}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`${styles.thumbnail} ${
                  selectedImage === idx ? styles.thumbnailSelected : ""
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={styles.thumbnailImg}
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <div className={styles.badges}>
            {product.isNewProduct && (
              <span className={`${styles.badge} ${styles.badgeNew}`}>
                Новинка
              </span>
            )}
            {product.oldPrice && (
              <span className={`${styles.badge} ${styles.badgeSale}`}>
                Акція
              </span>
            )}
          </div>

          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.rating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`${styles.starIcon} ${
                    i < Math.floor(product.rating)
                      ? styles.starFilled
                      : styles.starEmpty
                  }`}
                />
              ))}
            </div>
            <span className={styles.reviewCount}>
              ({product.reviewCount} відгуків)
            </span>
          </div>

          <div className={styles.priceSection}>
            <div className={styles.priceRow}>
              {product.oldPrice ? (
                <>
                  <span className={styles.price}>{product.price} грн</span>
                  <span className={styles.oldPrice}>
                    {product.oldPrice} грн
                  </span>
                  <span className={styles.discount}>
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              ) : (
                <span className={styles.price}>{product.price} грн</span>
              )}
            </div>
            <AvailabilityBadge
              availability={product.availability}
              stock={product.stock}
              size="large"
              showStock={true}
            />
          </div>

          {/* Quantity */}
          <div className={styles.quantitySection}>
            <label className={styles.quantityLabel}>Кількість:</label>
            <div className={styles.quantityControls}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={styles.quantityButton}
                disabled={quantity <= 1}
              >
                <Minus className={styles.smallIcon} />
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className={styles.quantityButton}
              >
                <Plus className={styles.smallIcon} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              onClick={handleAddToCart}
              className={`${styles.addToCartButton} ${
                isInCart
                  ? styles.addToCartButtonInCart
                  : styles.addToCartButtonDefault
              }`}
            >
              <ShoppingCart className={styles.icon} />
              {isInCart ? "В кошику" : "До кошика"}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`${styles.favoriteButton} ${
                isFavorite ? styles.favoriteButtonActive : ""
              }`}
            >
              <Heart
                className={`${styles.icon} ${
                  isFavorite ? styles.heartFilled : ""
                }`}
              />
            </button>
          </div>

          {/* Product Details */}
          <div className={styles.specifications}>
            <h3 className={styles.specificationsTitle}>Характеристики:</h3>
            <dl className={styles.specificationsList}>
              <div className={styles.specificationItem}>
                <dt className={styles.specificationLabel}>Бренд:</dt>
                <dd className={styles.specificationValue}>{product.brand}</dd>
              </div>
              <div className={styles.specificationItem}>
                <dt className={styles.specificationLabel}>Категорія:</dt>
                <dd className={styles.specificationValue}>
                  {product.category.name}
                </dd>
              </div>
              <div className={styles.specificationItem}>
                <dt className={styles.specificationLabel}>Артикул:</dt>
                <dd className={styles.specificationValue}>{product._id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={styles.descriptionCard}>
        <h2 className={styles.descriptionTitle}>Опис товару</h2>
        <p className={styles.descriptionText}>
          {product.description || "Опис товару буде доданий найближчим часом."}
        </p>
      </div>

      {/* Reviews */}
      <div className={styles.reviewsCard}>
        <h2 className={styles.reviewsTitle}>Відгуки покупців</h2>
        <ReviewsList productId={product._id} />
        <div className={styles.reviewForm}>
          <ReviewForm productId={product._id} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProductsList.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Схожі товари</h2>
          <div className={styles.relatedGrid}>
            {relatedProductsList.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/product/${relatedProduct.slug}`}
                className={styles.relatedCard}
              >
                <Image
                  src={relatedProduct.mainImage}
                  alt={relatedProduct.name}
                  className={styles.relatedImage}
                  width={200}
                  height={200}
                />
                <h3 className={styles.relatedName}>{relatedProduct.name}</h3>
                <p className={styles.relatedPrice}>
                  {relatedProduct.price} грн
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
