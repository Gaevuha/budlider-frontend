# 🚀 План міграції "Будлідер" на Next.js 14+ App Router + TypeScript (без Tailwind)

## 📋 Зміст
1. [Підготовка](#підготовка)
2. [Створення Next.js проєкту](#створення-nextjs-проєкту)
3. [Структура файлів](#структура-файлів)
4. [Міграція компонентів](#міграція-компонентів)
5. [Routing](#routing)
6. [State Management](#state-management)
7. [API Routes](#api-routes)
8. [CSS Modules](#css-modules)
9. [Checklist](#checklist)

---

## 1️⃣ Підготовка

### Експорт поточного проєкту
1. Експортуйте проєкт з Figma Make (Download)
2. Розпакуйте ZIP архів
3. Створіть backup

### Необхідні інструменти
```bash
node -v  # v18+ або v20+
npm -v   # або pnpm, yarn
```

---

## 2️⃣ Створення Next.js проєкту

```bash
# Створюємо новий Next.js проєкт БЕЗ Tailwind
npx create-next-app@latest budlider-next --typescript --no-tailwind --app --no-src

cd budlider-next

# Встановлюємо необхідні залежності
npm install @tanstack/react-query formik yup zustand
npm install lucide-react clsx
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-checkbox
npm install @radix-ui/react-tabs @radix-ui/react-slider
npm install @radix-ui/react-accordion @radix-ui/react-avatar
npm install motion izitoast date-fns
npm install @emailjs/browser
npm install react-paginate react-slick

# Dev dependencies
npm install -D @types/react @types/node
npm install -D @types/react-slick
```

---

## 3️⃣ Структура файлів

### Поточна структура (Vite + React Router)
```
src/
├── app/
│   ├── App.tsx              # Головний компонент
│   ├── Routes.tsx           # React Router конфігурація
│   ├── page.tsx             # Домашня сторінка
│   ├── about/page.tsx
│   ├── catalog/page.tsx
│   ├── product/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── profile/page.tsx
│   ├── wishlist/page.tsx
│   ├── components/          # Компоненти
│   ├── contexts/            # React Context
│   ├── hooks/               # Custom hooks
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   └── utils/               # Утиліти
├── styles/                  # Глобальні стилі
└── main.tsx                 # Entry point
```

### Нова структура (Next.js App Router)
```
budlider-next/
├── app/
│   ├── layout.tsx           # ✅ Root layout
│   ├── page.tsx             # ✅ Home page (/)
│   ├── page.module.css      # ✅ Стилі домашньої сторінки
│   ├── about/
│   │   ├── page.tsx         # /about
│   │   └── page.module.css
│   ├── catalog/
│   │   ├── page.tsx         # /catalog
│   │   └── page.module.css
│   ├── product/
│   │   └── [slug]/
│   │       ├── page.tsx     # /product/[slug]
│   │       └── page.module.css
│   ├── cart/
│   │   ├── page.tsx         # /cart
│   │   └── page.module.css
│   ├── checkout/
│   │   ├── page.tsx         # /checkout
│   │   └── page.module.css
│   ├── profile/
│   │   ├── page.tsx         # /profile
│   │   └── page.module.css
│   ├── wishlist/
│   │   ├── page.tsx         # /wishlist
│   │   └── page.module.css
│   ├── admin/
│   │   ├── orders/
│   │   │   ├── page.tsx     # /admin/orders
│   │   │   └── page.module.css
│   │   └── users/
│   │       ├── page.tsx     # /admin/users
│   │       └── page.module.css
│   ├── delivery/
│   │   ├── page.tsx         # /delivery
│   │   └── page.module.css
│   ├── services/
│   │   ├── page.tsx         # /services
│   │   └── page.module.css
│   ├── contacts/
│   │   ├── page.tsx         # /contacts
│   │   └── page.module.css
│   └── api/                 # ✅ API Routes
│       ├── users/
│       │   └── route.ts
│       └── reviews/
│           └── route.ts
│
├── components/              # ✅ Shared components
│   ├── ui/                  # UI primitives
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── input/
│   │   │   ├── Input.tsx
│   │   │   └── Input.module.css
│   │   └── ...
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   └── ProductCard.module.css
│   ├── CatalogFilters/
│   │   ├── CatalogFilters.tsx
│   │   └── CatalogFilters.module.css
│   └── ...
│
├── lib/                     # ✅ Утиліти, конфіги
│   ├── utils.ts
│   ├── localStorage.ts
│   ├── toast.ts
│   └── queryClient.ts
│
├── hooks/                   # ✅ Custom hooks
│   ├── useCart.ts
│   ├── useWishlist.ts
│   └── ...
│
├── store/                   # ✅ Zustand stores
│   ├── authModalStore.ts
│   ├── cartStore.ts
│   └── ...
│
├── types/                   # ✅ TypeScript types
│   └── index.ts
│
├── data/                    # ✅ Mock data
│   ├── mockData.ts
│   └── deliveryData.ts
│
├── providers/               # ✅ Context Providers
│   ├── AuthProvider.tsx
│   └── QueryProvider.tsx
│
├── styles/                  # ✅ Глобальні стилі
│   ├── globals.css         # Глобальні reset та базові стилі
│   ├── fonts.css           # Шрифти
│   ├── theme.css           # CSS змінні (кольори, відступи)
│   └── container.css       # Контейнери та layout
│
├── public/                  # Static assets
│   ├── images/
│   └── icons/
│
├── next.config.mjs          # ✅ Next.js config
├── tsconfig.json            # ✅ TypeScript config
└── package.json
```

---

## 4️⃣ Міграція компонентів

### TypeScript конвертація

#### ❌ Було (React):
```tsx
// src/app/components/ProductCard/ProductCard.tsx
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className={styles.card}>
        <h3>{product.name}</h3>
        <p className={styles.price}>{product.price} грн</p>
      </div>
    </Link>
  );
};
```

#### ✅ Стало (Next.js + TypeScript):
```tsx
// components/ProductCard/ProductCard.tsx
'use client'; // Client Component якщо використовує інтерактивність

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <Link href={`/product/${product.slug}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image 
            src={product.image} 
            alt={product.name}
            width={300}
            height={300}
            className={styles.image}
          />
        </div>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{product.price} грн</p>
      </div>
    </Link>
  );
};
```

```css
/* components/ProductCard/ProductCard.module.css */
.cardLink {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.imageWrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-brand);
}
```

### Client vs Server Components

#### Server Component (default)
```tsx
// app/catalog/page.tsx
import { CatalogFilters } from '@/components/CatalogFilters/CatalogFilters';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

// Це Server Component - без 'use client'
export default async function CatalogPage() {
  // Можна робити fetch прямо тут
  const products = await fetch('...').then(r => r.json());
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Каталог товарів</h1>
      <div className={styles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

#### Client Component (з інтерактивністю)
```tsx
// components/CatalogFilters/CatalogFilters.tsx
'use client'; // ❗ Обов'язково для компонентів з useState, useEffect, onClick

import { useState } from 'react';
import styles from './CatalogFilters.module.css';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export const CatalogFilters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  return (
    <div className={styles.filters}>
      <h3 className={styles.filtersTitle}>Фільтри</h3>
      {/* Фільтри */}
    </div>
  );
};
```

### Правила Client/Server Components

**Server Components (за замовчуванням):**
- ✅ Fetch data
- ✅ Доступ до backend ресурсів
- ✅ SEO-friendly
- ✅ Менший bundle size
- ❌ Не можна використовувати useState, useEffect
- ❌ Не можна використовувати browser APIs

**Client Components ('use client'):**
- ✅ useState, useEffect, useContext
- ✅ Event handlers (onClick, onChange)
- ✅ Browser APIs (localStorage, window)
- ✅ Custom hooks з state
- ❌ Більший bundle size

---

## 5️⃣ Routing

### React Router → Next.js

#### ❌ React Router (було):
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### ✅ Next.js App Router (стало):

Routing автоматичний через файлову структуру:
```
app/
├── page.tsx              → /
├── catalog/
│   └── page.tsx          → /catalog
├── product/
│   └── [slug]/
│       └── page.tsx      → /product/:slug
└── cart/
    └── page.tsx          → /cart
```

### Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Providers } from '@/providers/Providers';
import '@/styles/globals.css';
import '@/styles/fonts.css';
import '@/styles/theme.css';
import '@/styles/container.css';

export const metadata: Metadata = {
  title: 'Будлідер - Інтернет-магазин будівельних матеріалів',
  description: 'Якісні будівельні матеріали з доставкою по всій Україні',
  keywords: 'будівельні матеріали, цемент, цегла, інструменти',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

### Навігація

#### ❌ React Router:
```tsx
import { Link, useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/cart');
```

#### ✅ Next.js:
```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/cart');
```

### Динамічні роути

```tsx
// app/product/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import styles from './page.module.css';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Генерація metadata для SEO
export async function generateMetadata({ 
  params 
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  return {
    title: `${product.name} - Будлідер`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound(); // Показує 404
  }
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{product.name}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## 6️⃣ State Management

### Zustand (залишається незмінним)

```tsx
// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### React Query Provider

```tsx
// providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 хвилина
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Auth Provider

```tsx
// providers/AuthProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Завантаження користувача з localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    // Логіка логіну
    const user = { id: '1', email, name: 'User' };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Комбінований Provider

```tsx
// providers/Providers.tsx
'use client';

import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
```

---

## 7️⃣ API Routes

### Next.js API Routes

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');
  
  // Тут буде логіка отримання користувачів
  const users = [
    { id: '1', name: 'User 1', email: 'user1@test.com' },
  ];
  
  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Логіка створення користувача
  
  return NextResponse.json({ success: true }, { status: 201 });
}
```

```tsx
// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  
  // Отримання відгуків
  const reviews = []; // з DB або mockData
  
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const review = await request.json();
  
  // Збереження відгуку
  
  return NextResponse.json({ success: true });
}
```

### Використання API в компонентах

```tsx
// hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      return res.json();
    },
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (review: Review) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
```

---

## 8️⃣ TypeScript Types

```tsx
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  brand: string;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  stock: number;
  rating: number;
  reviewsCount: number;
  tags?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  delivery: {
    type: 'nova-poshta' | 'ukrposhta' | 'courier' | 'pickup';
    address?: string;
    city?: string;
    department?: string;
  };
  payment: {
    type: 'card' | 'cash' | 'online';
    status: 'pending' | 'paid' | 'failed';
  };
  createdAt: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  availability: string[];
  rating: number;
  search: string;
}
```

---

## 9️⃣ CSS Modules & Глобальні стилі

### Глобальні стилі

```css
/* styles/globals.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #1a1a1a;
  background-color: #ffffff;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

img {
  max-width: 100%;
  height: auto;
}
```

### CSS Змінні (Тема)

```css
/* styles/theme.css */
:root {
  /* Кольори бренду */
  --color-brand: #22c55e;
  --color-brand-dark: #16a34a;
  --color-brand-light: #4ade80;
  
  /* Нейтральні кольори */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Статуси */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
  
  /* Відступи */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  
  /* Радіуси */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Тіні */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Переходи */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

### Контейнер

```css
/* styles/container.css */
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-left: 4rem;
    padding-right: 4rem;
  }
}

@media (min-width: 1280px) {
  .container {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}
```

### CSS Modules для компонентів

```css
/* components/Button/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  transition: all var(--transition-base);
  cursor: pointer;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Варіанти */
.primary {
  background-color: var(--color-brand);
  color: var(--color-white);
}

.primary:hover:not(:disabled) {
  background-color: var(--color-brand-dark);
}

.secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
}

.outline {
  background-color: transparent;
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
}

.outline:hover:not(:disabled) {
  background-color: var(--color-brand);
  color: var(--color-white);
}

/* Розміри */
.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}
```

```tsx
// components/Button/Button.tsx
'use client';

import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const variantClass = styles[variant];
  const sizeClass = size !== 'medium' ? styles[size] : '';
  
  return (
    <button 
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

## 🔟 Next.js Configuration

### next.config.mjs

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Вимкнути Tailwind якщо не потрібен
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 1️⃣1️⃣ Міграція конкретних сторінок

### Home Page

```tsx
// app/page.tsx
import { Hero } from '@/components/Hero/Hero';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { mockProducts } from '@/data/mockData';
import styles from './page.module.css';

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 6);
  
  return (
    <>
      <Hero />
      
      <section className="container">
        <h2 className={styles.sectionTitle}>Популярні товари</h2>
        <div className={styles.productsGrid}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
```

```css
/* app/page.module.css */
.sectionTitle {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gray-900);
}

.productsGrid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .productsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .productsGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Catalog Page

```tsx
// app/catalog/page.tsx
'use client';

import { useState } from 'react';
import { CatalogFilters } from '@/components/CatalogFilters/CatalogFilters';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { Pagination } from '@/components/Pagination/Pagination';
import { mockProducts } from '@/data/mockData';
import type { FilterState } from '@/types';
import styles from './page.module.css';

export default function CatalogPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 10000],
    availability: [],
    rating: 0,
    search: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Фільтрація продуктів
  const filteredProducts = mockProducts.filter(product => {
    // Логіка фільтрації
    return true;
  });
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <div className="container">
      <h1 className={styles.title}>Каталог товарів</h1>
      
      <div className={styles.catalogLayout}>
        <aside className={styles.filters}>
          <CatalogFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>
        
        <div className={styles.products}>
          <div className={styles.productsGrid}>
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
```

```css
/* app/catalog/page.module.css */
.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gray-900);
}

.catalogLayout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .catalogLayout {
    grid-template-columns: 280px 1fr;
  }
}

.filters {
  position: sticky;
  top: 1rem;
  height: fit-content;
}

.productsGrid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .productsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .productsGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Product Detail Page

```tsx
// app/product/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { ReviewsList } from '@/components/ReviewsList/ReviewsList';
import { ReviewForm } from '@/components/ReviewForm/ReviewForm';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import { mockProducts } from '@/data/mockData';
import styles from './page.module.css';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string) {
  // В реальному проєкті - fetch з API
  return mockProducts.find(p => p.slug === slug);
}

export async function generateMetadata({ 
  params 
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Товар не знайдено',
    };
  }
  
  return {
    title: `${product.name} - Будлідер`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container">
      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            priority
            className={styles.productImage}
          />
        </div>
        
        <div className={styles.infoSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.price}>{product.price} грн</p>
          <p className={styles.description}>{product.description}</p>
          
          <AddToCartButton product={product} />
        </div>
      </div>
      
      <section className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Відгуки</h2>
        <ReviewForm productId={product.id} />
        <ReviewsList productId={product.id} />
      </section>
    </div>
  );
}
```

```css
/* app/product/[slug]/page.module.css */
.productLayout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 1024px) {
  .productLayout {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.imageSection {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-gray-50);
}

.productImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.infoSection {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.productName {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand);
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-gray-600);
}

.reviewsSection {
  border-top: 1px solid var(--color-gray-200);
  padding-top: 3rem;
}

.reviewsTitle {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gray-900);
}
```

### Cart Page

```tsx
// app/cart/page.tsx
'use client';

import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/components/CartItem/CartItem';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();
  
  const total = items.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );
  
  if (items.length === 0) {
    return (
      <div className="container">
        <div className={styles.emptyCart}>
          <h1 className={styles.title}>Кошик</h1>
          <p className={styles.emptyMessage}>Ваш кошик порожній</p>
          <Button onClick={() => router.push('/catalog')}>
            До каталогу
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <h1 className={styles.title}>Кошик</h1>
      
      <div className={styles.cartItems}>
        {items.map(item => (
          <CartItem 
            key={item.id} 
            item={item}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>
      
      <div className={styles.cartFooter}>
        <div className={styles.total}>
          <span className={styles.totalLabel}>Разом:</span>
          <span className={styles.totalPrice}>{total} грн</span>
        </div>
        
        <Button onClick={() => router.push('/checkout')}>
          Оформити замовлення
        </Button>
      </div>
    </div>
  );
}
```

```css
/* app/cart/page.module.css */
.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-gray-900);
}

.emptyCart {
  text-align: center;
  padding: 4rem 0;
}

.emptyMessage {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  margin-bottom: 2rem;
}

.cartItems {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cartFooter {
  border-top: 2px solid var(--color-gray-200);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.total {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.totalLabel {
  font-size: 1rem;
  color: var(--color-gray-600);
}

.totalPrice {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand);
}
```

---

## 1️⃣2️⃣ Middleware для захисту роутів

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth-token');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isProfileRoute = request.nextUrl.pathname.startsWith('/profile');
  
  // Захист адмін роутів
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Захист профілю
  if (isProfileRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
```

---

## 1️⃣3️⃣ Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Використання:
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 1️⃣4️⃣ Scripts в package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## ✅ CHECKLIST Міграції

### Підготовка
- [ ] Експортувати проєкт з Figma Make
- [ ] Створити новий Next.js проєкт **БЕЗ Tailwind**
- [ ] Встановити залежності
- [ ] Налаштувати TypeScript config

### Структура
- [ ] Створити папку `app/`
- [ ] Створити `app/layout.tsx`
- [ ] Перенести стилі в `styles/` (globals.css, theme.css, container.css)
- [ ] Створити папку `components/`
- [ ] Створити папку `lib/`, `hooks/`, `store/`, `types/`

### Компоненти
- [ ] Конвертувати всі `.tsx` в TypeScript з типами
- [ ] Додати `'use client'` де потрібно
- [ ] Замінити `<Link>` з react-router на `next/link`
- [ ] Замінити `<img>` на `<Image>` з next/image
- [ ] Замінити `useNavigate()` на `useRouter()`
- [ ] Перенести CSS Modules для кожного компонента

### Сторінки
- [ ] Створити `app/page.tsx` + `page.module.css` (Home)
- [ ] Створити `app/catalog/page.tsx` + `page.module.css`
- [ ] Створити `app/product/[slug]/page.tsx` + `page.module.css`
- [ ] Створити `app/cart/page.tsx` + `page.module.css`
- [ ] Створити `app/checkout/page.tsx` + `page.module.css`
- [ ] Створити `app/profile/page.tsx` + `page.module.css`
- [ ] Створити `app/wishlist/page.tsx` + `page.module.css`
- [ ] Створити `app/admin/orders/page.tsx` + `page.module.css`
- [ ] Створити `app/admin/users/page.tsx` + `page.module.css`

### API Routes
- [ ] Створити `app/api/users/route.ts`
- [ ] Створити `app/api/reviews/route.ts`
- [ ] Створити `app/api/orders/route.ts`

### Providers
- [ ] Створити `providers/QueryProvider.tsx`
- [ ] Створити `providers/AuthProvider.tsx`
- [ ] Створити `providers/Providers.tsx`
- [ ] Підключити providers в `layout.tsx`

### State Management
- [ ] Перевірити Zustand stores
- [ ] Налаштувати React Query
- [ ] Адаптувати localStorage utilities

### Конфігурація
- [ ] Налаштувати `next.config.mjs`
- [ ] Додати `.env.local`
- [ ] Створити `middleware.ts` для захисту роутів

### Стилі (CSS Modules)
- [ ] Створити глобальні стилі (`globals.css`, `theme.css`, `container.css`)
- [ ] Перенести всі `.module.css` файли
- [ ] Перевірити CSS змінні
- [ ] Адаптувати mobile-first підхід

### Тестування
- [ ] Запустити `npm run dev`
- [ ] Перевірити всі сторінки
- [ ] Перевірити навігацію
- [ ] Перевірити форми
- [ ] Перевірити кошик
- [ ] Перевірити відгуки
- [ ] Перевірити адмін панель
- [ ] Перевірити адаптивність

### Оптимізація
- [ ] Додати metadata для SEO
- [ ] Оптимізувати зображення
- [ ] Додати loading states
- [ ] Додати error boundaries
- [ ] Перевірити мобільну версію

### Деплой
- [ ] Запустити `npm run build`
- [ ] Перевірити build без помилок
- [ ] Деплой на Vercel/інший хостинг

---

## 🎯 Ключові відмінності React Router vs Next.js

| Аспект | React Router | Next.js |
|--------|-------------|---------|
| **Routing** | Програмний (Routes.tsx) | Файлова система |
| **Link** | `<Link to="/about">` | `<Link href="/about">` |
| **Navigation** | `useNavigate()` | `useRouter()` |
| **Params** | `useParams()` | `params` prop |
| **Images** | `<img src="">` | `<Image>` component |
| **Data Fetching** | useEffect + fetch | Server Components / API Routes |
| **Client Code** | Весь код | Тільки з `'use client'` |
| **SEO** | Потрібен SSR | Вбудований SSR/SSG |
| **Стилі** | CSS Modules ✅ | CSS Modules ✅ (без змін!) |

---

## 📚 Додаткові ресурси

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript with Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Data Fetching in Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [CSS Modules in Next.js](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

---

## 🚀 Готово до міграції!

Цей план покриває всі аспекти міграції вашого React проєкту на Next.js 14+ з TypeScript та **CSS Modules** (без Tailwind).

**Рекомендована послідовність:**
1. Створіть новий Next.js проєкт БЕЗ Tailwind ✅
2. Налаштуйте конфігурацію (tsconfig, next.config) ✅
3. Створіть глобальні стилі (globals.css, theme.css, container.css) ✅
4. Створіть providers та layout ✅
5. Мігруйте компоненти по одному з їх CSS Modules ✅
6. Створіть сторінки з їх стилями ✅
7. Налаштуйте API routes ✅
8. Протестуйте ✅
9. Деплой ✅

**Переваги CSS Modules:**
- ✅ Локальна область видимості стилів
- ✅ Уникнення конфліктів класів
- ✅ TypeScript підтримка
- ✅ Кращий control над стилями
- ✅ Простота перенесення з поточного проєкту

Успіхів у міграції! 🎉
