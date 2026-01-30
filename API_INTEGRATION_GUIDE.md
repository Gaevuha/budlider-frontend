# 🔌 Інтеграція реального API замість mock даних

## 📋 Зміст
1. [Поточний стан (Mock Data)](#поточний-стан-mock-data)
2. [Варіанти бекенду](#варіанти-бекенду)
3. [Next.js API Routes](#nextjs-api-routes)
4. [Supabase (Рекомендовано)](#supabase-рекомендовано)
5. [Prisma + PostgreSQL](#prisma--postgresql)
6. [MongoDB + Mongoose](#mongodb--mongoose)
7. [Зовнішній REST API](#зовнішній-rest-api)
8. [Міграція компонентів](#міграція-компонентів)

---

## 1️⃣ Поточний стан (Mock Data)

### Що зараз використовується

```tsx
// data/mockData.ts
export const mockProducts = [
  {
    id: '1',
    slug: 'cement-pcc-500',
    name: 'Цемент ПЦ І-500 50кг',
    price: 245,
    // ...
  },
  // ... більше продуктів
];
```

### Де використовується

```tsx
// app/catalog/page.tsx
import { mockProducts } from '@/data/mockData';

export default function CatalogPage() {
  const products = mockProducts; // ❌ Mock data
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 2️⃣ Варіанти бекенду

### Порівняння рішень

| Варіант | Складність | Вартість | Час налаштування | Рекомендація |
|---------|-----------|----------|------------------|--------------|
| **Supabase** | ⭐ Низька | Безкоштовно | 30 хв | ✅ Найкраще для старту |
| **Next.js API + Prisma** | ⭐⭐ Середня | Від $5/міс | 2-3 год | ✅ Гнучкість |
| **MongoDB Atlas** | ⭐⭐ Середня | Безкоштовно | 1-2 год | ✅ Для NoSQL |
| **Зовнішній API** | ⭐⭐⭐ Висока | Залежить | 1+ тиждень | Якщо вже є |

---

## 3️⃣ Next.js API Routes (Базовий підхід)

### Структура

```
app/
├── api/
│   ├── products/
│   │   ├── route.ts          # GET /api/products
│   │   └── [id]/
│   │       └── route.ts      # GET /api/products/[id]
│   ├── cart/
│   │   └── route.ts          # POST /api/cart
│   ├── orders/
│   │   └── route.ts          # POST /api/orders
│   └── reviews/
│       └── route.ts          # GET, POST /api/reviews
```

### Приклад: Products API

```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Тимчасово використовуємо mockData, поки не підключимо БД
import { mockProducts } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  let products = [...mockProducts];
  
  // Фільтрація
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (minPrice && maxPrice) {
    products = products.filter(p => 
      p.price >= Number(minPrice) && p.price <= Number(maxPrice)
    );
  }
  
  return NextResponse.json({
    products,
    total: products.length,
  });
}
```

```tsx
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = mockProducts.find(p => p.id === params.id);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Товар не знайдено' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
```

### Використання в компонентах

```tsx
// app/catalog/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  if (loading) return <div>Завантаження...</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### З React Query (краще)

```tsx
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';

interface ProductsResponse {
  products: Product[];
  total: number;
}

export function useProducts(filters?: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async (): Promise<ProductsResponse> => {
      const params = new URLSearchParams();
      
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });
}
```

```tsx
// app/catalog/page.tsx
'use client';

import { useProducts } from '@/hooks/useProducts';

export default function CatalogPage() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error.message}</div>;
  
  return (
    <div>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 4️⃣ Supabase (Рекомендовано для швидкого старту)

### Чому Supabase?
- ✅ PostgreSQL база даних
- ✅ Автоматичні REST API
- ✅ Real-time підтримка
- ✅ Аутентифікація з коробки
- ✅ Storage для файлів
- ✅ Безкоштовний план

### Налаштування

#### 1. Створіть проєкт на [supabase.com](https://supabase.com)

#### 2. Встановіть клієнт

```bash
npm install @supabase/supabase-js
```

#### 3. Створіть таблиці в Supabase Dashboard

```sql
-- Таблиця products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image TEXT,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  availability TEXT DEFAULT 'in-stock',
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблиця orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  delivery_type TEXT NOT NULL,
  delivery_address TEXT,
  payment_type TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблиця order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Таблиця reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Налаштуйте змінні середовища

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 5. Створіть Supabase клієнт

```tsx
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### 6. Імпортуйте mock дані в Supabase

```tsx
// scripts/seed-database.ts
import { supabase } from '@/lib/supabase';
import { mockProducts } from '@/data/mockData';

async function seedDatabase() {
  console.log('Seeding database...');
  
  // Очистити таблицю (опціонально)
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Вставити продукти
  const { data, error } = await supabase
    .from('products')
    .insert(mockProducts.map(product => ({
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      old_price: product.oldPrice,
      image: product.image,
      category: product.category,
      brand: product.brand,
      availability: product.availability,
      stock: product.stock,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      tags: product.tags,
    })));
  
  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log(`✅ Inserted ${data?.length} products`);
  }
}

seedDatabase();
```

Запустіть:
```bash
npx tsx scripts/seed-database.ts
```

#### 7. Оновіть API routes для використання Supabase

```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  let query = supabase.from('products').select('*');
  
  // Фільтри
  if (category) {
    query = query.eq('category', category);
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  if (minPrice && maxPrice) {
    query = query.gte('price', Number(minPrice))
                 .lte('price', Number(maxPrice));
  }
  
  const { data: products, error } = await query;
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    products,
    total: products?.length || 0,
  });
}
```

```tsx
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error || !product) {
    return NextResponse.json(
      { error: 'Товар не знайдено' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
```

#### 8. Створіть API для замовлень

```tsx
// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, items, total, delivery, payment } = body;
  
  // Створити замовлення
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total,
      delivery_type: delivery.type,
      delivery_address: delivery.address,
      payment_type: payment.type,
      payment_status: payment.status,
    })
    .select()
    .single();
  
  if (orderError) {
    return NextResponse.json(
      { error: orderError.message },
      { status: 500 }
    );
  }
  
  // Додати товари до замовлення
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    return NextResponse.json(
      { error: itemsError.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ 
    success: true, 
    orderId: order.id 
  }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data: orders, error } = await query;
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json(orders);
}
```

#### 9. API для відгуків

```tsx
// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('productId');
  
  let query = supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (productId) {
    query = query.eq('product_id', productId);
  }
  
  const { data: reviews, error } = await query;
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, userId, userName, rating, comment } = body;
  
  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: userId,
      user_name: userName,
      rating,
      comment,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  // Оновити рейтинг продукту
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId);
  
  if (reviews) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await supabase
      .from('products')
      .update({
        rating: avgRating,
        reviews_count: reviews.length,
      })
      .eq('id', productId);
  }
  
  return NextResponse.json({ 
    success: true, 
    review 
  }, { status: 201 });
}
```

---

## 5️⃣ Prisma + PostgreSQL

### Налаштування

#### 1. Встановіть Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

#### 2. Налаштуйте schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id            String   @id @default(uuid())
  slug          String   @unique
  name          String
  description   String?
  price         Decimal  @db.Decimal(10, 2)
  oldPrice      Decimal? @db.Decimal(10, 2) @map("old_price")
  image         String
  category      String
  brand         String
  availability  String   @default("in-stock")
  stock         Int      @default(0)
  rating        Decimal  @default(0) @db.Decimal(2, 1)
  reviewsCount  Int      @default(0) @map("reviews_count")
  tags          String[]
  createdAt     DateTime @default(now()) @map("created_at")
  
  reviews       Review[]
  orderItems    OrderItem[]
  
  @@map("products")
}

model Order {
  id              String      @id @default(uuid())
  userId          String?     @map("user_id")
  status          String      @default("pending")
  total           Decimal     @db.Decimal(10, 2)
  deliveryType    String      @map("delivery_type")
  deliveryAddress String?     @map("delivery_address")
  paymentType     String      @map("payment_type")
  paymentStatus   String      @default("pending") @map("payment_status")
  createdAt       DateTime    @default(now()) @map("created_at")
  
  items           OrderItem[]
  
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String  @map("order_id")
  productId String  @map("product_id")
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}

model Review {
  id        String   @id @default(uuid())
  productId String   @map("product_id")
  userId    String?  @map("user_id")
  userName  String   @map("user_name")
  rating    Int
  comment   String?
  createdAt DateTime @default(now()) @map("created_at")
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("reviews")
}
```

#### 3. Створіть клієнт

```tsx
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### 4. Міграція БД

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 5. Seed data

```tsx
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { mockProducts } from '../data/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  for (const product of mockProducts) {
    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        category: product.category,
        brand: product.brand,
        availability: product.availability,
        stock: product.stock,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        tags: product.tags || [],
      },
    });
  }
  
  console.log('✅ Database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```bash
npx prisma db seed
```

#### 6. Оновіть API routes

```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  
  const where: any = {};
  
  if (category) {
    where.category = category;
  }
  
  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }
  
  if (minPrice && maxPrice) {
    where.price = {
      gte: Number(minPrice),
      lte: Number(maxPrice),
    };
  }
  
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  
  return NextResponse.json({
    products,
    total: products.length,
  });
}
```

---

## 6️⃣ MongoDB + Mongoose

### Налаштування

```bash
npm install mongoose
```

```tsx
// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

```tsx
// models/Product.ts
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  image: String,
  category: { type: String, required: true },
  brand: { type: String, required: true },
  availability: { type: String, default: 'in-stock' },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
```

---

## 7️⃣ Міграція hooks на реальний API

### useProducts

```tsx
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';

export function useProducts(filters?: any) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });
}
```

### useOrders

```tsx
// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useOrders(userId?: string) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const params = userId ? `?userId=${userId}` : '';
      const res = await fetch(`/api/orders${params}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

### useReviews

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
    mutationFn: async (review: any) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.productId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['products'] 
      });
    },
  });
}
```

---

## 8️⃣ Checklist міграції на реальний API

### Підготовка
- [ ] Обрати варіант бекенду (Supabase/Prisma/MongoDB)
- [ ] Створити базу даних
- [ ] Налаштувати змінні середовища

### База даних
- [ ] Створити схему/таблиці
- [ ] Імпортувати mock дані
- [ ] Налаштувати індекси

### API Routes
- [ ] Створити `/api/products` (GET)
- [ ] Створити `/api/products/[id]` (GET)
- [ ] Створити `/api/orders` (GET, POST)
- [ ] Створити `/api/reviews` (GET, POST)
- [ ] Додати обробку помилок
- [ ] Додати валідацію

### Hooks
- [ ] Оновити `useProducts`
- [ ] Оновити `useOrders`
- [ ] Оновити `useReviews`
- [ ] Видалити імпорти `mockData`

### Компоненти
- [ ] Оновити каталог
- [ ] Оновити сторінку товару
- [ ] Оновити кошик
- [ ] Оновити оформлення замовлення
- [ ] Оновити профіль
- [ ] Оновити адмін панель

### Тестування
- [ ] Перевірити отримання товарів
- [ ] Перевірити фільтрацію
- [ ] Перевірити пошук
- [ ] Перевірити створення замовлення
- [ ] Перевірити додавання відгуків
- [ ] Перевірити адмін функції

---

## 🎯 Рекомендована послідовність

1. **День 1: Налаштування Supabase**
   - Створити проєкт
   - Створити таблиці
   - Імпортувати дані

2. **День 2: API Routes**
   - Створити products API
   - Протестувати в Postman

3. **День 3: Міграція компонентів**
   - Оновити каталог
   - Оновити сторінку товару

4. **День 4: Orders & Reviews**
   - API для замовлень
   - API для відгуків

5. **День 5: Тестування**
   - Повне тестування
   - Виправлення багів

---

## 📚 Корисні посилання

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query](https://tanstack.com/query/latest)

---

**Успіхів з міграцією на реальний API! 🚀**
