export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent?: string | null;
  order?: number;
  isActive?: boolean;
  subcategories?: string[];
  productCount?: number;
  isPopular?: boolean;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  category: Category;
  brand: string;
  images: string[];
  mainImage: string;
  characteristics: Record<string, any>;
  stock: number;
  availability: "in_stock" | "out_of_stock" | "pre_order";
  rating: number;
  reviewCount: number;
  tags: string[];
  isNewProduct: boolean;
  isFeatured: boolean;
  isActive: boolean;
  seoKeywords: string[];
  badges: string[];
  isOnSale: boolean;
  oldPrice: number | null;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface Filters {
  categories: string[];
  brands: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: "novaposhta" | "ukrposhta" | "courier" | "self-pickup";
  deliveryAddress: string;
  comment?: string;
  paymentMethod: "cash" | "card_delivery" | "card_online";
  status:
    | "new"
    | "processing"
    | "completed"
    | "cancelled"
    | "paid"
    | "pending"
    | "shipped"
    | "received";
  createdAt: Date | string;
  type?: "product" | "service" | "quick";
  serviceName?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  addresses?: string[];
  role: "user" | "admin";
  authProvider?: "local" | "google" | "facebook";
  wishlist?: string[];
  cart?: Array<{
    product: string;
    quantity: number;
    _id?: string;
  }>;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  createdAt: string;
  helpful: number;
  unhelpful: number;
  images?: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void> | void;
  updateProfile: (data: Partial<User>) => Promise<void> | void;
}
