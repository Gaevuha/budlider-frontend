// API сервіс для роботи з відгуками
const API_BASE_URL = process.env.API_URL || "https://api.budlider.com";

export interface CreateReviewDto {
  rating: number;
  text: string;
  guestName?: string;
}

export interface ReviewResponse {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  text: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export const reviewsApi = {
  // Отримати відгуки для товару
  async getProductReviews(productId: string): Promise<ReviewResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Створити новий відгук
  async createReview(
    productId: string,
    data: CreateReviewDto
  ): Promise<ReviewResponse> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create review");
    }

    return await response.json();
  },

  // Позначити відгук як корисний
  async markHelpful(reviewId: string): Promise<void> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/reviews/${reviewId}/helpful`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark review as helpful");
    }
  },

  // Позначити відгук як некорисний
  async markUnhelpful(reviewId: string): Promise<void> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/reviews/${reviewId}/unhelpful`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark review as unhelpful");
    }
  },
};
