import { useMemo } from 'react';
import { useReviewsStore } from '@/store/reviewsStore';

export function useProductReviews(productId: string) {
  const { getProductReviews } = useReviewsStore();
  const reviews = getProductReviews(productId);

  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        reviewCount: 0,
        reviews,
      };
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Округлення до 1 знака після коми
      reviewCount: reviews.length,
      reviews,
    };
  }, [reviews]);

  return stats;
}