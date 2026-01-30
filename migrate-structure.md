# Інструкція по міграції структури

## Крок 1: Створення всіх сторінок в новій структурі

Я створю всі файли поетапно. Ось список файлів які потрібно створити:

### 1. HomePage - ✅ СТВОРЕНО
- `/src/app/(routes)/home/page.tsx` ✅

### 2. CatalogPage - ПОТРІБНО СТВОРИТИ
Файли:
- `/src/app/(routes)/catalog/page.tsx`
- `/src/app/(routes)/catalog/page.module.css`

### 3. ProductDetailPage - ПОТРІБНО СТВОРИТИ  
Файли:
- `/src/app/(routes)/product/page.tsx`
- `/src/app/(routes)/product/page.module.css`

### 4-13. Інші сторінки (без CSS, крім зазначених вище)

## Крок 2: Оновлення App.tsx

Замінити імпорти:
```typescript
// Старі імпорти
import { HomePage } from '@/app/pages/HomePage';
import { CatalogPage } from '@/app/pages/CatalogPage';

// Нові імпорти  
import { HomePage } from '@/app/(routes)/home/page';
import { CatalogPage } from '@/app/(routes)/catalog/page';
```

## Крок 3: Видалення старих файлів

Після перевірки що все працює - видалити `/src/app/pages/`

---

Давайте почнемо створювати по одній сторінці за раз.
