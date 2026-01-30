import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, CreateReviewDto } from '@/services/reviewsApi';
import { useReviewsStore } from '@/store/reviewsStore';
import { Review } from '@/types';

// Конвертер з бекенд формату в наш локальний формат
const convertBackendReview = (backendReview: any): Omit<Review, 'id' | 'createdAt' | 'helpful'> => ({
  productId: backendReview.product,
  userId: backendReview.user._id,
  userName: backendReview.user.name,
  userAvatar: backendReview.user.avatar,
  rating: backendReview.rating,
  text: backendReview.text,
});

export function useReviews(productId: string) {
  const queryClient = useQueryClient();
  const { addReview: addLocalReview, getProductReviews } = useReviewsStore();

  // Завантаження відгуків з бекенду
  const { data: backendReviews, isLoading, error } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.getProductReviews(productId),
    staleTime: 5 * 60 * 1000, // 5 хвилин
    retry: 1,
  });

  // Локальні відгуки з LocalStorage
  const localReviews = getProductReviews(productId);

  // Об'єднання бекенд та локальних відгуків
  const allReviews = backendReviews 
    ? [...backendReviews.map(convertBackendReview).map((r, index) => ({
        ...r,
        id: `backend-${index}`,
        createdAt: backendReviews[index].createdAt,
        helpful: backendReviews[index].helpful || 0,
      })), ...localReviews]
    : localReviews;

  // Mutation для створення відгуку
  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewDto & { productId: string }) => 
      reviewsApi.createReview(data.productId, { rating: data.rating, text: data.text }),
    onSuccess: (data, variables) => {
      // Інвалідуємо кеш для перезавантаження
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    },
  });

  return {
    reviews: allReviews,
    isLoading,
    error,
    createReview: createReviewMutation.mutateAsync,
    isCreating: createReviewMutation.isPending,
  };
}