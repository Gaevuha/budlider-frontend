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
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    name: string;
    phone: string;
    city: string;
    street: string;
    building: string;
  };
  deliveryMethod: "courier" | "pickup" | "post";
  paymentMethod: "cash" | "card_delivery" | "card_online";
  status?: "new";
  name?: string;
  phone?: string;
  comment?: string;
}): Promise<any> {
  const res = await apiClient.post("/orders/quick", data);
  return res.data;
}
import { apiClient } from "./api";
import type { Product } from "@/types/index";

let cachedCategories: any[] | null = null;
let cachedCategoriesAt = 0;
let categoriesPromise: Promise<any> | null = null;

let cachedBrands: any[] | null = null;
let cachedBrandsAt = 0;
let brandsPromise: Promise<any> | null = null;

const CATALOG_CACHE_TTL = 60_000;

export type ProductsQueryParams = Omit<Partial<Product>, "category"> & {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string[];
  category?: string | string[];
  categorySlug?: string | string[];
  categoryId?: string | string[];
  brands?: string[];
  brand?: string | string[];
  brandSlug?: string | string[];
  priceMin?: number;
  priceMax?: number;
  minPrice?: number;
  maxPrice?: number;
  price_min?: number;
  price_max?: number;
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
  const now = Date.now();
  if (cachedBrands && now - cachedBrandsAt < CATALOG_CACHE_TTL) {
    return cachedBrands;
  }
  if (brandsPromise) return brandsPromise;

  brandsPromise = (async () => {
    let lastError: any;
    try {
      console.debug("[fetchBrandsClient] fallback to /products");
      const res = await apiClient.get("/products", { params: { limit: 500 } });
      const products =
        res.data?.data?.products || res.data?.products || res.data?.data || [];
      if (Array.isArray(products)) {
        const derived = Array.from(
          new Set(
            products
              .map((product) => product?.brand)
              .filter((brand) => typeof brand === "string" && brand.length > 0)
          )
        );
        cachedBrands = derived;
        cachedBrandsAt = Date.now();
        return derived;
      }
    } catch (error) {
      lastError = error;
      const status = (error as any)?.response?.status;
      if (status === 429) {
        cachedBrands = [];
        cachedBrandsAt = Date.now();
        return [];
      }
    }
    if (lastError) {
      console.error("[fetchBrandsClient] all endpoints failed", lastError);
    }
    return [];
  })();

  try {
    return await brandsPromise;
  } finally {
    brandsPromise = null;
  }
}

/* ==================== CATEGORIES API ==================== */

export async function fetchCategoriesClient(): Promise<any> {
  const now = Date.now();
  if (cachedCategories && now - cachedCategoriesAt < CATALOG_CACHE_TTL) {
    return cachedCategories;
  }
  if (categoriesPromise) return categoriesPromise;

  categoriesPromise = (async () => {
    const endpoints = ["/categories"];
    let lastError: any;
    for (const endpoint of endpoints) {
      try {
        console.debug("[fetchCategoriesClient] request", endpoint);
        const res = await apiClient.get(endpoint);
        cachedCategories = res.data;
        cachedCategoriesAt = Date.now();
        return res.data;
      } catch (error) {
        console.warn("[fetchCategoriesClient] failed", endpoint, error);
        const status = (error as any)?.response?.status;
        if (status === 429) {
          cachedCategories = [];
          cachedCategoriesAt = Date.now();
          return [];
        }
        lastError = error;
      }
    }
    if (lastError) {
      console.error("[fetchCategoriesClient] all endpoints failed", lastError);
    }
    return [];
  })();

  try {
    return await categoriesPromise;
  } finally {
    categoriesPromise = null;
  }
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
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const res = await apiClient.post("/orders", data);
      return res.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.error?.message;
      const isDuplicateOrderNumber =
        status === 409 &&
        (message?.includes("orderNumber") ||
          message?.includes("order number") ||
          message?.includes("duplicate"));

      if (!isDuplicateOrderNumber || attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }

  throw new Error("Не вдалося створити замовлення");
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

export async function deleteOrderAdminClient(id: string): Promise<any> {
  const res = await apiClient.delete(`/orders/${id}`);
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
