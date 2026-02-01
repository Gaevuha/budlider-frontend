// Aliases for hooks compatibility
export const getCart = fetchCartClient;
export const addToCart = addToCartClient;
export const updateCartItem = updateCartItemClient;
export const removeFromCart = removeFromCartClient;
export const clearCart = clearCartClient;
export const syncCart = async (items: any[]) => {
  // Implement sync logic if needed, or just return
  return Promise.resolve();
};

export const getWishlist = fetchWishlistClient;
export const addToWishlist = addToWishlistClient;
export const removeFromWishlist = removeFromWishlistClient;
export const syncWishlist = async (items: any[]) => {
  // Implement sync logic if needed, or just return
  return Promise.resolve();
};

export const createOrder = createOrderClient;
export const getUserOrders = fetchOrdersClient;
export const getOrderById = fetchOrderClient;
// ==================== QUICK ORDER API ====================
export async function createQuickOrder(data: {
  productId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  comment?: string;
}): Promise<any> {
  const res = await apiClient.post("/orders/quick", data);
  return res.data;
}
import { apiClient } from "./api";
import type { Product } from "@/types/index";

export type ProductsQueryParams = Partial<Product> & {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string[];
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  sort?: string;
  slug?: string;
};

export interface CreateReviewDto {
  rating: number;
  text: string;
  guestName?: string;
}

export interface ReviewResponse {
  _id: string;
  user?: {
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

/* ==================== PRODUCTS API ==================== */

export async function fetchProductsClient(
  params?: ProductsQueryParams
): Promise<any> {
  const res = await apiClient.get("/products", { params });
  return res.data;
}

export async function fetchProductClient(id: string): Promise<any> {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
}

export async function searchProductsClient(params: any): Promise<any> {
  const res = await apiClient.get("/products/search", { params });
  return res.data;
}

export async function fetchBrandsClient(): Promise<any> {
  const res = await apiClient.get("/products/brands");
  return res.data;
}

/* ==================== CATEGORIES API ==================== */

export async function fetchCategoriesClient(): Promise<any> {
  const res = await apiClient.get("/categories");
  return res.data;
}

export async function fetchCategoryClient(slug: string): Promise<any> {
  const res = await apiClient.get(`/categories/${slug}`);
  return res.data;
}

/* ==================== AUTH API ==================== */

export async function registerClient(data: any): Promise<any> {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
}

export async function loginClient(data: any): Promise<any> {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
}

export async function logoutClient(): Promise<any> {
  const res = await apiClient.post("/auth/logout");
  return res.data;
}

export async function getMeClient(): Promise<any> {
  const res = await apiClient.get("/auth/me");
  return res.data;
}

export async function updateProfileClient(data: any): Promise<any> {
  const res = await apiClient.put("/auth/update-profile", data);
  return res.data;
}

export async function changePasswordClient(data: any): Promise<any> {
  const res = await apiClient.put("/auth/change-password", data);
  return res.data;
}

/* ==================== CART API ==================== */

export async function fetchCartClient(): Promise<any> {
  const res = await apiClient.get("/users/cart");
  return res.data;
}

export async function addToCartClient(data: any): Promise<any> {
  const res = await apiClient.post("/users/cart", data);
  return res.data;
}

export async function clearCartClient(): Promise<any> {
  const res = await apiClient.delete("/users/cart");
  return res.data;
}

export async function updateCartItemClient(
  productId: string,
  data: any
): Promise<any> {
  const res = await apiClient.put(`/users/cart/${productId}`, data);
  return res.data;
}

export async function removeFromCartClient(productId: string): Promise<any> {
  const res = await apiClient.delete(`/users/cart/${productId}`);
  return res.data;
}

/* ==================== WISHLIST API ==================== */

export async function fetchWishlistClient(): Promise<any> {
  const res = await apiClient.get("/users/wishlist");
  return res.data;
}

export async function addToWishlistClient(productId: string): Promise<any> {
  const res = await apiClient.post(`/users/wishlist/${productId}`, {});
  return res.data;
}

export async function removeFromWishlistClient(
  productId: string
): Promise<any> {
  const res = await apiClient.delete(`/users/wishlist/${productId}`);
  return res.data;
}

/* ==================== ORDERS API ==================== */

export async function fetchOrdersClient(params?: any): Promise<any> {
  const res = await apiClient.get("/orders", { params });
  return res.data;
}

export async function fetchOrderClient(id: string): Promise<any> {
  const res = await apiClient.get(`/orders/${id}`);
  return res.data;
}

export async function createOrderClient(data: any): Promise<any> {
  const res = await apiClient.post("/orders", data);
  return res.data;
}

export async function cancelOrderClient(id: string): Promise<any> {
  const res = await apiClient.put(`/orders/${id}/cancel`, {});
  return res.data;
}

/* ==================== ADMIN API ==================== */

export async function fetchAllOrdersClient(params?: any): Promise<any> {
  const res = await apiClient.get("/orders/admin/all", { params });
  return res.data;
}

export async function updateOrderStatusClient(
  id: string,
  data: any
): Promise<any> {
  const res = await apiClient.put(`/orders/admin/${id}/status`, data);
  return res.data;
}

export async function fetchUsersClient(params?: any): Promise<any> {
  const res = await apiClient.get("/users", { params });
  return res.data;
}

export async function fetchUserClient(id: string): Promise<any> {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
}

export async function updateUserClient(id: string, data: any): Promise<any> {
  const res = await apiClient.put(`/users/${id}`, data);
  return res.data;
}

export async function deleteUserClient(id: string): Promise<any> {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
}

/* ==================== REVIEWS API ==================== */

export async function fetchProductReviewsClient(
  productId: string,
  params?: any
): Promise<ReviewResponse[]> {
  const res = await apiClient.get(`/reviews/products/${productId}`, { params });
  return res.data;
}

export async function createReviewClient(
  productId: string,
  data: CreateReviewDto
): Promise<ReviewResponse> {
  const res = await apiClient.post(`/reviews/products/${productId}`, data);
  return res.data;
}

export async function updateReviewClient(id: string, data: any): Promise<any> {
  const res = await apiClient.put(`/reviews/reviews/${id}`, data);
  return res.data;
}

export async function deleteReviewClient(id: string): Promise<any> {
  const res = await apiClient.delete(`/reviews/reviews/${id}`);
  return res.data;
}

export async function likeReviewClient(id: string): Promise<any> {
  const res = await apiClient.post(`/reviews/reviews/${id}/like`, {});
  return res.data;
}

export async function dislikeReviewClient(id: string): Promise<any> {
  const res = await apiClient.post(`/reviews/reviews/${id}/dislike`, {});
  return res.data;
}

export async function approveReviewClient(id: string): Promise<any> {
  const res = await apiClient.put(`/reviews/admin/reviews/${id}/approve`, {});
  return res.data;
}

export async function respondReviewClient(id: string, data: any): Promise<any> {
  const res = await apiClient.post(
    `/reviews/admin/reviews/${id}/response`,
    data
  );
  return res.data;
}

/* ==================== ADDRESSES API ==================== */

export async function addAddressClient(data: any): Promise<any> {
  const res = await apiClient.post("/users/addresses", data);
  return res.data;
}

export async function deleteAddressClient(addressId: string): Promise<any> {
  const res = await apiClient.delete(`/users/addresses/${addressId}`);
  return res.data;
}
