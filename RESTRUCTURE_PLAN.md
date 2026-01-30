# План реструктуризації проєкту

## ✅ Вже створено:
- `/src/app/(routes)/home/page.tsx`
- `/src/app/@modal/quick-order/QuickOrderModal.tsx`
- `/src/app/@modal/quick-order/QuickOrderModal.module.css`

## 📋 Потрібно створити:

### Модальні вікна (@modal):
1. `/src/app/@modal/auth/AuthModal.tsx` - з `/src/app/components/AuthModal/AuthModal.tsx`
2. `/src/app/@modal/auth/AuthModal.module.css` - з `/src/app/components/AuthModal/AuthModal.module.css`

### Сторінки ((routes)):
1. `/src/app/(routes)/catalog/page.tsx` - з `/src/app/pages/CatalogPage.tsx`
2. `/src/app/(routes)/catalog/page.module.css` - з `/src/app/pages/CatalogPage.module.css`
3. `/src/app/(routes)/product/page.tsx` - з `/src/app/pages/ProductDetailPage.tsx`
4. `/src/app/(routes)/product/page.module.css` - з `/src/app/pages/ProductDetailPage.module.css`
5. `/src/app/(routes)/cart/page.tsx` - з `/src/app/pages/CartPage.tsx`
6. `/src/app/(routes)/wishlist/page.tsx` - з `/src/app/pages/FavoritesPage.tsx`
7. `/src/app/(routes)/checkout/page.tsx` - з `/src/app/pages/CheckoutPage.tsx`
8. `/src/app/(routes)/services/page.tsx` - з `/src/app/pages/ServicesPage.tsx`
9. `/src/app/(routes)/about/page.tsx` - з `/src/app/pages/AboutPage.tsx`
10. `/src/app/(routes)/delivery/page.tsx` - з `/src/app/pages/DeliveryPage.tsx`
11. `/src/app/(routes)/contacts/page.tsx` - з `/src/app/pages/ContactsPage.tsx`
12. `/src/app/(routes)/profile/page.tsx` - з `/src/app/pages/ProfilePage.tsx`
13. `/src/app/(routes)/admin/orders/page.tsx` - з `/src/app/pages/AdminOrdersPage.tsx`

## 🔄 Оновити імпорти в:
- `/src/app/App.tsx` - всі routes та модалки
- Компоненти які використовують модалки

## 🗑️ Видалити після переносу:
- `/src/app/pages/` - вся папка
- `/src/app/components/QuickOrderModal/` - перенесено в @modal
- `/src/app/components/AuthModal/` - перенесено в @modal

## 📁 Нова структура:
```
/src/app/
  - App.tsx (головний layout)
  
  /@modal/
    /auth/
      - AuthModal.tsx
      - AuthModal.module.css
    /quick-order/
      - QuickOrderModal.tsx
      - QuickOrderModal.module.css
  
  /(routes)/
    /home/
      - page.tsx
    /catalog/
      - page.tsx
      - page.module.css
    /product/
      - page.tsx
      - page.module.css
    /cart/
      - page.tsx
    /wishlist/
      - page.tsx
    /checkout/
      - page.tsx
    /services/
      - page.tsx
    /about/
      - page.tsx
    /delivery/
      - page.tsx
    /contacts/
      - page.tsx
    /profile/
      - page.tsx
    /admin/
      /orders/
        - page.tsx
  
  /components/ (залишаються як є)
  /contexts/ (залишаються як є)
  /hooks/ (залишаються як є)
  /utils/ (залишаються як є)
  /types/ (залишаються як є)
  /data/ (залишаються як є)
```
