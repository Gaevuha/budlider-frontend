import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, AuthContextType } from "@/types/index";
import { toast } from "@/lib/utils/toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Завантаження користувача з localStorage при монтуванні
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Симуляція API запиту
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Перевірка демо облікових записів
    if (email === "admin@budlider.com" && password === "admin123") {
      const adminUser: User = {
        _id: "1",
        email: "admin@budlider.com",
        name: "Адміністратор",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      const demoToken = "demo_admin_token_" + Date.now();
      setUser(adminUser);
      setToken(demoToken);
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("token", demoToken);
      toast.success(`Вітаємо, ${adminUser.name}!`, "Успішний вхід");
      return;
    }

    if (email === "user@example.com" && password === "user123") {
      const regularUser: User = {
        _id: "2",
        email: "user@example.com",
        name: "Іван Петренко",
        phone: "+380501234567",
        role: "user",
        createdAt: new Date().toISOString(),
      };
      const demoToken = "demo_user_token_" + Date.now();
      setUser(regularUser);
      setToken(demoToken);
      localStorage.setItem("user", JSON.stringify(regularUser));
      localStorage.setItem("token", demoToken);
      toast.success(`Вітаємо, ${regularUser.name}!`, "Успішний вхід");
      return;
    }

    throw new Error("Невірний email або пароль");
  };

  const register = async (name: string, email: string, password: string) => {
    // Симуляція API запиту
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Перевірка чи користувач вже існує
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      throw new Error("Користувач з таким email вже існує");
    }

    const newUser: User = {
      _id: Date.now().toString(),
      email,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    const demoToken = "demo_token_" + Date.now();
    setUser(newUser);
    setToken(demoToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", demoToken);
    localStorage.setItem(`user_${email}`, JSON.stringify({ email, password }));
    toast.success(
      `Вітаємо, ${newUser.name}! Ваш акаунт успішно створено.`,
      "Реєстрація успішна"
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("Ви успішно вийшли з акаунту", "До побачення");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
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
