# 📁 Структура проєкту Next.js для "Будлідер"

## 🎯 Правила структури

### 1️⃣ **Кожен компонент у своїй папці з CSS модулем**

```
components/
├── ProductCard/
│   ├── ProductCard.tsx       # Компонент
│   └── ProductCard.module.css # Стилі
├── CatalogFilters/
│   ├── CatalogFilters.tsx
│   └── CatalogFilters.module.css
└── SortDropdown/
    ├── SortDropdown.tsx
    └── SortDropdown.module.css
```

### 2️⃣ **Сторінки з page.tsx та page.module.css**

```
app/
├── page.tsx              # Головна сторінка
├── page.module.css       # Стилі головної
├── catalog/
│   ├── page.tsx          # Сторінка каталогу
│   └── page.module.css   # Стилі каталогу
└── product/
    └── [slug]/
        ├── page.tsx
        └── page.module.css
```

---

## 📂 Повна структура проєкту

```
budlider-next/
├── app/                           # 🔥 Next.js App Router
│   ├── layout.tsx                # Root layout (Header + Footer)
│   ├── page.tsx                  # Головна сторінка (/)
│   ├── page.module.css
│   │
│   ├── about/
│   │   ├── page.tsx              # /about
│   │   └── page.module.css
│   │
│   ├── catalog/
│   │   ├── page.tsx              # /catalog
│   │   └── page.module.css
│   │
│   ├── product/
│   │   └── [slug]/
│   │       ├── page.tsx          # /product/[slug]
│   │       └── page.module.css
│   │
│   ├── cart/
│   │   ├── page.tsx              # /cart
│   │   └── page.module.css
│   │
│   ├── checkout/
│   │   ├── page.tsx              # /checkout
│   │   └── page.module.css
│   │
│   ├── profile/
│   │   ├── page.tsx              # /profile
│   │   └── page.module.css
│   │
│   ├── wishlist/
│   │   ├── page.tsx              # /wishlist
│   │   └── page.module.css
│   │
│   ├── admin/
│   │   ├── orders/
│   │   │   ├── page.tsx          # /admin/orders
│   │   │   └── page.module.css
│   │   └── users/
│   │       ├── page.tsx          # /admin/users
│   │       └── page.module.css
│   │
│   ├── delivery/
│   │   ├── page.tsx              # /delivery
│   │   └── page.module.css
│   │
│   ├── services/
│   │   ├── page.tsx              # /services
│   │   └── page.module.css
│   │
│   ├── contacts/
│   │   ├── page.tsx              # /contacts
│   │   └── page.module.css
│   │
│   └── api/                      # 🔥 API Routes
│       ├── users/
│       │   └── route.ts          # GET, POST, PUT, DELETE /api/users
│       ├── reviews/
│       │   └── route.ts          # GET, POST /api/reviews
│       └── orders/
│           └── route.ts          # GET, POST /api/orders
│
├── components/                    # 🔥 React компоненти
│   │
│   ├── ui/                       # Базові UI компоненти
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── Input.module.css
│   │   ├── Select/
│   │   │   ├── Select.tsx
│   │   │   └── Select.module.css
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       └── Modal.module.css
│   │
│   ├── Header/                   # Шапка сайту
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   │
│   ├── Footer/                   # Підвал сайту
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   │
│   ├── Hero/                     # Головний банер
│   │   ├── Hero.tsx
│   │   └── Hero.module.css
│   │
│   ├── ProductCard/              # Картка товару
│   │   ├── ProductCard.tsx
│   │   └── ProductCard.module.css
│   │
│   ├── CatalogFilters/           # 🎯 Фільтри каталогу (окремий компонент)
│   │   ├── CatalogFilters.tsx
│   │   └── CatalogFilters.module.css
│   │
│   ├── SortDropdown/             # 🎯 Сортування (окремий компонент)
│   │   ├── SortDropdown.tsx
│   │   └── SortDropdown.module.css
│   │
│   ├── Pagination/               # Пагінація
│   │   ├── Pagination.tsx
│   │   └── Pagination.module.css
│   │
│   ├── AuthModal/                # Модалка авторизації
│   │   ├── AuthModal.tsx
│   │   └── AuthModal.module.css
│   │
│   ├── QuickOrderModal/          # Швидке замовлення
│   │   ├── QuickOrderModal.tsx
│   │   └── QuickOrderModal.module.css
│   │
│   ├── DeliverySelection/        # Вибір доставки
│   │   ├── DeliverySelection.tsx
│   │   └── DeliverySelection.module.css
│   │
│   ├── ReviewForm/               # Форма відгуку
│   │   ├── ReviewForm.tsx
│   │   └── ReviewForm.module.css
│   │
│   ├── ReviewsList/              # Список відгуків
│   │   ├── ReviewsList.tsx
│   │   └── ReviewsList.module.css
│   │
│   ├── AvailabilityBadge/        # Бейдж наявності
│   │   ├── AvailabilityBadge.tsx
│   │   └── AvailabilityBadge.module.css
│   │
│   ├── BurgerMenu/               # Мобільне меню
│   │   ├── BurgerMenu.tsx
│   │   └── BurgerMenu.module.css
│   │
│   ├── ProfileEditModal/         # Редагування профілю
│   │   ├── ProfileEditModal.tsx
│   │   └── ProfileEditModal.module.css
│   │
│   ├── UserEditModal/            # Редагування користувача (адмін)
│   │   ├── UserEditModal.tsx
│   │   └── UserEditModal.module.css
│   │
│   └── CardPaymentForm/          # Форма оплати карткою
│       ├── CardPaymentForm.tsx
│       └── CardPaymentForm.module.css
│
├── lib/                          # 🔥 Утиліти та хелпери
│   ├── utils.ts                 # Загальні утиліти
│   ├── localStorage.ts          # Робота з localStorage
│   ├── toast.ts                 # Сповіщення
│   └── queryClient.ts           # React Query конфігурація
│
├── hooks/                        # 🔥 Custom React hooks
│   ├── useCart.ts               # Хук кошика
│   ├── useWishlist.ts           # Хук обраного
│   ├── useAuth.ts               # Хук авторизації
│   ├── useBreakpoint.ts         # Хук для responsive
│   └── useOrders.ts             # Хук замовлень
│
├── store/                        # 🔥 Zustand stores (для клієнтського стану)
│   ├── authModalStore.ts        # Стан модалки авторизації
│   ├── cartStore.ts             # Стан кошика (для гостей)
│   └── favoritesStore.ts        # Стан обраного (для гостей)
│
├── types/                        # 🔥 TypeScript types
│   └── index.ts                 # Всі типи проєкту
│
├── data/                         # 🔥 Mock data (тимчасово)
│   ├── mockData.ts              # Mock товари
│   └── deliveryData.ts          # Дані доставки
│
├── providers/                    # 🔥 Context Providers
│   ├── QueryProvider.tsx        # React Query Provider
│   ├── AuthProvider.tsx         # Авторизація Provider
│   └── Providers.tsx            # Комбінований Provider
│
├── styles/                       # 🔥 Глобальні стилі
│   ├── globals.css              # Глобальні reset + базові стилі
│   ├── fonts.css                # Імпорт шрифтів
│   ├── theme.css                # CSS змінні (кольори, відступи)
│   └── container.css            # Контейнери та layout утиліти
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero-bg.jpg
│   └── icons/
│       └── favicon.ico
│
├── middleware.ts                 # 🔥 Next.js Middleware (захист роутів)
├── next.config.mjs              # 🔥 Next.js конфігурація
├── tsconfig.json                # TypeScript конфігурація
├── package.json
├── .env.local                   # Environment variables (не комітиться)
└── README.md
```

---

## 🎨 Приклади правильної структури

### ✅ Правильно: Компонент CatalogFilters

```
components/
└── CatalogFilters/
    ├── CatalogFilters.tsx
    └── CatalogFilters.module.css
```

**CatalogFilters.tsx:**
```tsx
import styles from './CatalogFilters.module.css';

interface CatalogFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function CatalogFilters({ filters, onFiltersChange }: CatalogFiltersProps) {
  return (
    <div className={styles.filters}>
      {/* Фільтри */}
    </div>
  );
}
```

**CatalogFilters.module.css:**
```css
.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filterSection {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}
```

---

### ✅ Правильно: Компонент SortDropdown

```
components/
└── SortDropdown/
    ├── SortDropdown.tsx
    └── SortDropdown.module.css
```

**SortDropdown.tsx:**
```tsx
import styles from './SortDropdown.module.css';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className={styles.sortingWrapper}>
      <label htmlFor="sort" className={styles.sortingLabel}>
        Сортування:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={styles.sortingSelect}
      >
        <option value="default">За замовчуванням</option>
        <option value="price-asc">Ціна: зростання</option>
        <option value="price-desc">Ціна: спадання</option>
        <option value="name">За назвою</option>
      </select>
    </div>
  );
}
```

---

### ✅ Правильно: Сторінка каталогу

```
app/
└── catalog/
    ├── page.tsx
    └── page.module.css
```

**page.tsx використовує окремі компоненти:**
```tsx
import { CatalogFilters } from '@/components/CatalogFilters/CatalogFilters';
import { SortDropdown } from '@/components/SortDropdown/SortDropdown';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function CatalogPage() {
  return (
    <div className={styles.catalog}>
      <aside className={styles.sidebar}>
        <CatalogFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </aside>
      <main className={styles.content}>
        <SortDropdown value={sortBy} onChange={setSortBy} />
        <div className={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## ❌ Неправильні приклади

### ❌ НЕ РОБИТИ: Файли без папок

```
❌ components/
   ├── CatalogFilters.tsx
   ├── CatalogFilters.module.css
   ├── SortDropdown.tsx
   └── SortDropdown.module.css
```

### ❌ НЕ РОБИТИ: CSS не в папці компонента

```
❌ components/
   ├── CatalogFilters/
   │   └── CatalogFilters.tsx
   └── styles/
       └── CatalogFilters.module.css
```

### ❌ НЕ РОБИТИ: Все в одному файлі page.tsx

```tsx
❌ // Не вбудовувати фільтри та сортування безпосередньо в page.tsx
export default function CatalogPage() {
  return (
    <div>
      {/* 200+ рядків коду фільтрів тут */}
      {/* 50+ рядків коду сортування тут */}
    </div>
  );
}
```

---

## 🎯 Рекомендації

### 1. **Розділяйте логіку на компоненти**
- ✅ Фільтри → окремий компонент `CatalogFilters`
- ✅ Сортування → окремий компонент `SortDropdown`
- ✅ Картка товару → окремий компонент `ProductCard`
- ✅ Пагінація → окремий компонент `Pagination`

### 2. **Кожен компонент у своїй папці**
```
ComponentName/
├── ComponentName.tsx
└── ComponentName.module.css
```

### 3. **Імпорти з @/ alias**
```tsx
// ✅ Правильно
import { CatalogFilters } from '@/components/CatalogFilters/CatalogFilters';

// ❌ Неправильно
import { CatalogFilters } from '../../components/CatalogFilters/CatalogFilters';
```

### 4. **CSS Modules для стилів**
```tsx
// ✅ Правильно
import styles from './ProductCard.module.css';

<div className={styles.card}>...</div>

// ❌ Неправильно (Tailwind класи)
<div className="bg-white rounded-lg shadow-md">...</div>
```

### 5. **TypeScript для типізації**
```tsx
// ✅ Правильно
interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, isFavorite, onAddToCart }: ProductCardProps) {
  // ...
}
```

---

## 📚 Міграційний скрипт підтримує цю структуру

Скрипт `migrate-to-nextjs.js` **автоматично копіює**:

✅ Всі папки компонентів з `.tsx` та `.css` файлами  
✅ Всі `.tsx` та `.css` файли з папок сторінок  
✅ Рекурсивно копіює всю структуру `components/`  

```bash
node migrate-to-nextjs.js
```

Результат:
```
src/app/components/CatalogFilters/
├── CatalogFilters.tsx
└── CatalogFilters.module.css

→ копіюється в →

components/CatalogFilters/
├── CatalogFilters.tsx
└── CatalogFilters.module.css
```

---

## ✅ Checklist правильної структури

- [ ] Кожен компонент у своїй папці
- [ ] CSS модуль поряд з .tsx файлом
- [ ] Фільтри — окремий компонент `CatalogFilters/`
- [ ] Сортування — окремий компонент `SortDropdown/`
- [ ] Сторінки використовують `page.tsx` + `page.module.css`
- [ ] Імпорти через `@/` alias
- [ ] TypeScript типізація для всіх пропсів
- [ ] CSS Modules замість Tailwind класів

---

**Успіхів з Next.js! 🚀**
