'use client';

import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { Review } from '@/types';
import { useReviewsStore } from '@/store/reviewsStore';
import styles from './ReviewsList.module.css';

interface ReviewsListProps {
  productId: string;
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const { getProductReviews, markHelpful, markUnhelpful } = useReviewsStore();
  const reviews = getProductReviews(productId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Поки що немає відгуків про цей товар</p>
        <p className={styles.emptySubtext}>Будьте першим, хто залишить відгук!</p>
      </div>
    );
  }

  // Підрахунок статистики
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage: (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100,
  }));

  return (
    <div className={styles.container}>
      {/* Статистика */}
      <div className={styles.statistics}>
        <div className={styles.averageRating}>
          <div className={styles.ratingNumber}>{averageRating.toFixed(1)}</div>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`${styles.star} ${
                  star <= Math.round(averageRating) ? styles.starFilled : ''
                }`}
              />
            ))}
          </div>
          <div className={styles.reviewCount}>На основі {reviews.length} відгуків</div>
        </div>

        <div className={styles.distribution}>
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className={styles.distributionRow}>
              <span className={styles.distributionLabel}>{rating} зірок</span>
              <div className={styles.distributionBar}>
                <div
                  className={styles.distributionFill}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={styles.distributionCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Список відгуків */}
      <div className={styles.list}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.review}>
            <div className={styles.reviewHeader}>
              <div className={styles.userInfo}>
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className={styles.userName}>{review.userName}</div>
                  <div className={styles.date}>{formatDate(review.createdAt)}</div>
                </div>
              </div>

              <div className={styles.rating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`${styles.reviewStar} ${
                      star <= review.rating ? styles.reviewStarFilled : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className={styles.comment}>{review.text}</p>

            <div className={styles.reviewFooter}>
              <button
                onClick={() => markHelpful(review.id)}
                className={styles.helpfulButton}
              >
                <ThumbsUp className={styles.thumbIcon} />
                <span>Корисно ({review.helpful || 0})</span>
              </button>
              
              <button
                onClick={() => markUnhelpful(review.id)}
                className={styles.unhelpfulButton}
              >
                <ThumbsDown className={styles.thumbIcon} />
                <span>Некорисно ({review.unhelpful || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}