import { Cart, CartItem, Order } from "@/types/index";

const CART_KEY = "buildleader_cart";
const FAVORITES_KEY = "buildleader_favorites";
const ORDERS_KEY = "buildleader_orders";

export const cartStorage = {
  getCart(): Cart {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : { items: [] };
    } catch {
      return { items: [] };
    }
  },

  saveCart(cart: Cart): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  },

  addToCart(productId: string, quantity: number = 1): Cart {
    const cart = this.getCart();
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    this.saveCart(cart);
    return cart;
  },

  updateQuantity(productId: string, quantity: number): Cart {
    const cart = this.getCart();
    const item = cart.items.find((item) => item.productId === productId);

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((item) => item.productId !== productId);
      } else {
        item.quantity = quantity;
      }
      this.saveCart(cart);
    }

    return cart;
  },

  removeFromCart(productId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter((item) => item.productId !== productId);
    this.saveCart(cart);
    return cart;
  },

  clearCart(): void {
    this.saveCart({ items: [] });
  },
};

export const favoritesStorage = {
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  },

  toggleFavorite(productId: string): string[] {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(productId);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(productId);
    }

    this.saveFavorites(favorites);
    return favorites;
  },

  isFavorite(productId: string): boolean {
    return this.getFavorites().includes(productId);
  },
};

export const ordersStorage = {
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  },

  addOrder(order: Order): Order[] {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
    return orders;
  },

  removeOrder(orderId: string): Order[] {
    const orders = this.getOrders();
    const index = orders.findIndex((order) => order.id === orderId);

    if (index > -1) {
      orders.splice(index, 1);
      this.saveOrders(orders);
    }

    return orders;
  },

  updateOrderStatus(orderId: string, status: Order["status"]): Order[] {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);

    if (order) {
      order.status = status;
      this.saveOrders(orders);
    }

    return orders;
  },

  clearOrders(): void {
    this.saveOrders([]);
  },
};
