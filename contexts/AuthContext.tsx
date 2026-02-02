import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, AuthContextType } from "@/types/index";
import { toast } from "@/lib/utils/toast";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import {
  registerClient,
  loginClient,
  logoutClient,
  getMeClient,
  updateProfileClient,
  fetchCartClient,
  fetchWishlistClient,
} from "@/lib/api/apiClient";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setAuthCookie = (value: string | null) => {
    if (typeof document === "undefined") return;
    if (value) {
      document.cookie = `auth-token=${value}; path=/; max-age=2592000`;
    } else {
      document.cookie = "auth-token=; path=/; max-age=0";
    }
  };

  const isGuestToken = (value: string | null | undefined) =>
    typeof value === "string" &&
    (value.startsWith("demo_") ||
      value.startsWith("mock-") ||
      value === "guest");

  const hasAuthCookie = () =>
    typeof document !== "undefined" &&
    document.cookie.split(";").some((cookie) => {
      const trimmed = cookie.trim();
      return (
        trimmed.startsWith("auth-token=") ||
        trimmed.startsWith("accessToken=") ||
        trimmed.startsWith("access_token=")
      );
    });

  const normalizeCartItems = (payload: any) => {
    const raw =
      payload?.data?.items ||
      payload?.items ||
      payload?.data?.cart?.items ||
      payload?.data?.cart ||
      payload?.cart?.items ||
      payload?.cart ||
      payload?.cart?.items ||
      payload?.data ||
      [];

    if (!Array.isArray(raw)) return [];

    return raw
      .map((item) => ({
        productId:
          item?.productId ||
          item?.product?._id ||
          item?.product ||
          item?._id ||
          item?.id,
        quantity: Number(item?.quantity ?? item?.qty ?? 1),
      }))
      .filter((item) => Boolean(item.productId));
  };

  const normalizeWishlist = (payload: any) => {
    const raw =
      payload?.data?.items ||
      payload?.items ||
      payload?.data?.wishlist ||
      payload?.wishlist ||
      payload?.data ||
      [];

    if (!Array.isArray(raw)) return [];

    return raw
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.productId || item?.product?._id || item?._id || item?.id
      )
      .filter(Boolean);
  };

  const syncUserData = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetchCartClient(),
        fetchWishlistClient(),
      ]);

      const cartItems = normalizeCartItems(cartRes);
      const favorites = normalizeWishlist(wishlistRes);

      useCartStore.getState().setItems(cartItems);
      useFavoritesStore.getState().setFavorites(favorites);
    } catch (error) {
      // ignore sync errors
    }
  };

  // Завантаження користувача з localStorage при монтуванні
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
      setAuthCookie(savedToken);
    }
    if (savedUser && (savedToken || hasAuthCookie())) {
      syncUserData();
    }
    if (
      !savedUser &&
      !isGuestToken(savedToken) &&
      (savedToken || hasAuthCookie())
    ) {
      getMeClient()
        .then((res) => {
          const currentUser = res?.data?.user || res?.user || res;
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
            syncUserData();
          }
        })
        .catch(() => undefined);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginClient({ email, password });
    const authUser = res?.data?.user || res?.user;
    const authToken = res?.data?.token || res?.token;

    if (authUser) {
      setUser(authUser);
      localStorage.setItem("user", JSON.stringify(authUser));
      syncUserData();
    }
    if (authToken) {
      setToken(authToken);
      localStorage.setItem("token", authToken);
      setAuthCookie(authToken);
    }

    if (!authUser) {
      const me = await getMeClient();
      const currentUser = me?.data?.user || me?.user || me;
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        syncUserData();
      }
    }

    toast.success("Вітаємо!", "Успішний вхід");
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerClient({ name, email, password });
    const authUser = res?.data?.user || res?.user;
    const authToken = res?.data?.token || res?.token;

    if (authUser) {
      setUser(authUser);
      localStorage.setItem("user", JSON.stringify(authUser));
      syncUserData();
    }
    if (authToken) {
      setToken(authToken);
      localStorage.setItem("token", authToken);
      setAuthCookie(authToken);
    }

    toast.success(
      `Вітаємо${authUser?.name ? `, ${authUser.name}` : ""}!`,
      "Реєстрація успішна"
    );
  };

  const logout = async () => {
    try {
      await logoutClient();
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("budlider-cart-storage");
    localStorage.removeItem("budlider-favorites-storage");
    localStorage.removeItem("buildleader_cart");
    localStorage.removeItem("buildleader_favorites");
    sessionStorage.removeItem("budlider-cart-storage");
    sessionStorage.removeItem("budlider-favorites-storage");
    sessionStorage.removeItem("buildleader_cart");
    sessionStorage.removeItem("buildleader_favorites");
    useCartStore.getState().clearCart();
    useFavoritesStore.getState().clearFavorites();
    setAuthCookie(null);
    toast.info("Ви успішно вийшли з акаунту", "До побачення");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    const res = await updateProfileClient(data);
    const updatedUser = res?.data?.user || res?.user || { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Профіль успішно оновлено");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
