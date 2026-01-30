# Система відгуків - Будлідер

## Огляд

Система відгуків для інтернет-магазину «Будлідер» з підтримкою як бекенд API, так і локального зберігання в LocalStorage.

## Архітектура

### Компоненти

1. **ReviewForm** (`/src/app/components/ReviewForm/`)
   - Форма для додавання відгуків
   - Валідація: мінімум 10 символів, рейтинг 1-5 зірок
   - Інтеграція з авторизацією
   - Автоматичне fallback на LocalStorage якщо API недоступний

2. **ReviewsList** (`/src/app/components/ReviewsList/`)
   - Відображення списку відгуків
   - Статистика: середній рейтинг, розподіл оцінок
   - Можливість позначити відгук як корисний
   - Адаптивний дизайн

### Store

**reviewsStore** (`/src/store/reviewsStore.ts`)
- Zustand store з persist middleware
- Зберігання в LocalStorage під ключем `budlider-reviews`
- Методи:
  - `addReview()` - додати відгук
  - `getProductReviews()` - отримати відгуки товару
  - `markHelpful()` - позначити відгук корисним

### API Service

**reviewsApi** (`/src/app/services/reviewsApi.ts`)

#### Ендпоінти:

1. **GET** `/products/:productId/reviews`
   - Отримати всі відгуки для товару
   
2. **POST** `/products/:productId/reviews`
   - Створити новий відгук
   - Body:
     ```json
     {
       "rating": 5,
       "text": "string"
     }
     ```
   - Headers: `Authorization: Bearer <token>`

3. **POST** `/reviews/:reviewId/helpful`
   - Позначити відгук корисним
   - Headers: `Authorization: Bearer <token>`

#### Response Format:

```typescript
{
  "_id": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "avatar": "string?"
  },
  "product": "string",
  "rating": number,
  "text": "string",
  "helpful": number,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Hooks

**useReviews** (`/src/app/hooks/useReviews.ts`)
- React Query хук для роботи з відгуками
- Автоматичне завантаження з бекенду
- Кешування на 5 хвилин
- Об'єднання бекенд + локальних відгуків

## Використання

### На сторінці товару:

```tsx
import { ReviewForm } from '@/app/components/ReviewForm';
import { ReviewsList } from '@/app/components/ReviewsList';

function ProductPage() {
  return (
    <div>
      <ReviewsList productId={product._id} />
      <ReviewForm productId={product._id} />
    </div>
  );
}
```

### З React Query:

```tsx
import { useReviews } from '@/app/hooks/useReviews';

function Component() {
  const { reviews, isLoading, createReview } = useReviews(productId);
  
  const handleSubmit = async () => {
    await createReview({ 
      productId, 
      rating: 5, 
      text: 'Відмінний товар!' 
    });
  };
}
```

## Конфігурація

### Environment Variables:

```env
VITE_API_URL=https://api.budlider.com
```

### Стилі:

Всі компоненти використовують CSS Modules з брендовими кольорами:
- Primary: `#22c55e` (зелений)
- Hover: `#15803d` (темніший зелений)
- Rating: `#fbbf24` (жовтий для зірок)

## Fallback стратегія

1. **При створенні відгуку:**
   - Спочатку спроба відправити на бекенд
   - Якщо API недоступний → збереження в LocalStorage
   - Toast повідомлення про успіх в обох випадках

2. **При завантаженні відгуків:**
   - React Query намагається завантажити з бекенду
   - Одночасно завантажуються локальні відгуки
   - Відображаються об'єднані дані

## Особливості

✅ Повна валідація форми  
✅ Інтеграція з авторизацією  
✅ Адаптивний дизайн (mobile/tablet/desktop)  
✅ Автоматичне збереження в LocalStorage  
✅ React Query для кешування  
✅ Fallback на локальне зберігання  
✅ Брендовий дизайн  
✅ Toast повідомлення  
✅ Статистика та аналітика відгуків  

## Типи даних

### Review (Frontend)

```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  text: string; // мінімум 10 символів
  createdAt: string;
  helpful: number;
  images?: string[];
}
```

### CreateReviewDto (Backend)

```typescript
interface CreateReviewDto {
  rating: number;
  text: string;
}
```

## Безпека

- Авторизація через JWT токен в localStorage (`auth_token`)
- Перевірка авторизації перед створенням відгуку
- Валідація даних на frontend
- CORS headers для API запитів

## Тестування

Для тестування без бекенду:
1. Не встановлюйте `VITE_API_URL` або встановіть невірний URL
2. Система автоматично перейде на LocalStorage
3. Всі відгуки будуть зберігатися локально
