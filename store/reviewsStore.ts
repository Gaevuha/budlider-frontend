import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review } from '@/types';

interface ReviewsState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'unhelpful'>) => void;
  getProductReviews: (productId: string) => Review[];
  markHelpful: (reviewId: string) => void;
  markUnhelpful: (reviewId: string) => void;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          helpful: 0,
          unhelpful: 0,
        };
        
        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));
      },
      
      getProductReviews: (productId) => {
        return get().reviews
          .filter((review) => review.productId === productId)
          .map((review) => ({
            ...review,
            unhelpful: review.unhelpful ?? 0, // Fallback для старих відгуків
          }));
      },
      
      markHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          ),
        }));
      },
      
      markUnhelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, unhelpful: (review.unhelpful || 0) + 1 }
              : review
          ),
        }));
      },
    }),
    {
      name: 'budlider-reviews',
    }
  )
);
