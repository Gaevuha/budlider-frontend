import axios from "axios";
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

// Створюємо axios instance для серверних запитів
const apiServer = axios.create({
  baseURL: process.env.API_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Додаємо перехоплювач для логування
apiServer.interceptors.request.use(
  (config) => {
    console.log("🔍 Server API Request:", {
      url: config.url,
      params: config.params,
      baseURL: config.baseURL,
    });
    return config;
  },
  (error) => {
    console.error("❌ Server API Request Error:", error);
    return Promise.reject(error);
  }
);

apiServer.interceptors.response.use(
  (response) => {
    console.log("✅ Server API Response:", {
      url: response.config.url,
      status: response.status,
      dataCount: response.data?.data?.products?.length || 0,
    });
    return response;
  },
  (error) => {
    console.error("❌ Server API Response Error:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      params: error.config?.params,
    });
    return Promise.reject(error);
  }
);

/* ==================== PRODUCTS API SERVER ==================== */

export async function fetchProductsServer(
  params?: ProductsQueryParams
): Promise<any> {
  try {
    console.log("📡 Server: Fetching products with params:", params);
    const res = await apiServer.get("/api/products", { params });
    console.log(
      "✅ Server: API response data count:",
      res.data?.data?.products?.length
    );
    return (
      res.data?.data || {
        products: [],
        pagination: {
          currentPage: params?.page || 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
          itemsPerPage: params?.limit || 9,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Server: Products fetch failed:", error.message);
    return {
      products: [],
      pagination: {
        currentPage: params?.page || 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
        itemsPerPage: params?.limit || 9,
      },
    };
  }
}

export async function fetchProductServer(id: string): Promise<any> {
  const res = await apiServer.get(`/api/products/${id}`);
  return res.data;
}

export async function searchProductsServer(params: any): Promise<any> {
  const res = await apiServer.get("/api/products/search", { params });
  return res.data;
}

export async function fetchBrandsServer(): Promise<any> {
  const res = await apiServer.get("/api/products/brands");
  return res.data;
}

/* ==================== CATEGORIES API SERVER ==================== */

export async function fetchCategoriesServer(): Promise<any> {
  try {
    console.log("📡 Server: Fetching categories");
    const res = await apiServer.get("/api/categories");
    console.log("✅ Server: Categories fetch successful", {
      categoriesCount: res.data?.data?.length || 0,
    });

    // Повертаємо тільки дані, не всю обгортку
    return res.data?.data || [];
  } catch (error: any) {
    console.error("❌ Server: Categories fetch failed:", error.message);
    return [];
  }
}

export async function fetchCategoryServer(slug: string): Promise<any> {
  const res = await apiServer.get(`/api/categories/${slug}`);
  return res.data;
}

/* ==================== AUTH API SERVER ==================== */

export async function registerServer(data: any): Promise<any> {
  const res = await apiServer.post("/api/auth/register", data);
  return res.data;
}

export async function loginServer(data: any): Promise<any> {
  const res = await apiServer.post("/api/auth/login", data);
  return res.data;
}

export async function getMeServer(token: string): Promise<any> {
  const res = await apiServer.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProfileServer(
  token: string,
  data: any
): Promise<any> {
  const res = await apiServer.put("/api/auth/update-profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function changePasswordServer(
  token: string,
  data: any
): Promise<any> {
  const res = await apiServer.put("/api/auth/change-password", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ==================== CART API SERVER ==================== */

export async function fetchCartServer(token: string): Promise<any> {
  const res = await apiServer.get("/api/users/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addToCartServer(token: string, data: any): Promise<any> {
  const res = await apiServer.post("/api/users/cart", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function clearCartServer(token: string): Promise<any> {
  const res = await apiServer.delete("/api/users/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateCartItemServer(
  token: string,
  productId: string,
  data: any
): Promise<any> {
  const res = await apiServer.put(`/api/users/cart/${productId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function removeFromCartServer(
  token: string,
  productId: string
): Promise<any> {
  const res = await apiServer.delete(`/api/users/cart/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ==================== WISHLIST API SERVER ==================== */

export async function fetchWishlistServer(token: string): Promise<any> {
  const res = await apiServer.get("/api/users/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addToWishlistServer(
  token: string,
  productId: string
): Promise<any> {
  const res = await apiServer.post(
    `/api/users/wishlist/${productId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function removeFromWishlistServer(
  token: string,
  productId: string
): Promise<any> {
  const res = await apiServer.delete(`/api/users/wishlist/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ==================== REVIEWS API SERVER ==================== */

export async function fetchProductReviewsServer(
  productId: string,
  params?: any
): Promise<ReviewResponse[]> {
  const res = await apiServer.get(`/api/reviews/products/${productId}`, {
    params,
  });
  return res.data;
}

export async function createReviewServer(
  token: string | undefined,
  productId: string,
  data: CreateReviewDto
): Promise<ReviewResponse> {
  const res = await apiServer.post(`/api/reviews/products/${productId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}

export async function updateReviewServer(
  token: string,
  id: string,
  data: any
): Promise<any> {
  const res = await apiServer.put(`/api/reviews/reviews/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteReviewServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.delete(`/api/reviews/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function likeReviewServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.post(
    `/api/reviews/reviews/${id}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function dislikeReviewServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.post(
    `/api/reviews/reviews/${id}/dislike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function approveReviewServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.put(
    `/api/reviews/admin/reviews/${id}/approve`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

export async function respondReviewServer(
  token: string,
  id: string,
  data: any
): Promise<any> {
  const res = await apiServer.post(
    `/api/reviews/admin/reviews/${id}/response`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/* ==================== ORDERS API SERVER ==================== */

export async function fetchOrdersServer(
  token: string,
  params?: any
): Promise<any> {
  const res = await apiServer.get("/api/orders", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchOrderServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.get(`/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createOrderServer(
  token: string,
  data: any
): Promise<any> {
  const res = await apiServer.post("/api/orders", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function cancelOrderServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.put(
    `/api/orders/${id}/cancel`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/* ==================== ADMIN API SERVER ==================== */

export async function fetchAllOrdersServer(
  token: string,
  params?: any
): Promise<any> {
  const res = await apiServer.get("/api/orders/admin/all", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateOrderStatusServer(
  token: string,
  id: string,
  data: any
): Promise<any> {
  const res = await apiServer.put(`/api/orders/admin/${id}/status`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchUsersServer(
  token: string,
  params?: any
): Promise<any> {
  const res = await apiServer.get("/api/users", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchUserServer(token: string, id: string): Promise<any> {
  const res = await apiServer.get(`/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateUserServer(
  token: string,
  id: string,
  data: any
): Promise<any> {
  const res = await apiServer.put(`/api/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteUserServer(
  token: string,
  id: string
): Promise<any> {
  const res = await apiServer.delete(`/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ==================== ADDRESSES API SERVER ==================== */

export async function addAddressServer(token: string, data: any): Promise<any> {
  const res = await apiServer.post("/api/users/addresses", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteAddressServer(
  token: string,
  addressId: string
): Promise<any> {
  const res = await apiServer.delete(`/api/users/addresses/${addressId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
