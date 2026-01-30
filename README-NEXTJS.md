# Будлідер - Next.js 14+

## 🚀 Запуск проєкту

```bash
# Встановлення залежностей
npm install

# Запуск dev сервера
npm run dev

# Білд для продакшн
npm run build

# Запуск продакшн сервера
npm start
```

## 📁 Структура проєкту

```
app/           - Next.js App Router (сторінки)
components/    - React компоненти
lib/           - Утиліти та хелпери
hooks/         - Custom React hooks
store/         - Zustand stores
types/         - TypeScript types
data/          - Mock data
providers/     - Context providers
styles/        - Глобальні стилі
```

## ✅ Що було зроблено

- ✅ Міграція на Next.js 14+ App Router
- ✅ Конвертація React Router → Next.js routing
- ✅ TypeScript підтримка
- ✅ CSS Modules
- ✅ API Routes
- ✅ Server & Client Components
- ✅ Middleware для захисту роутів

## 📚 Документація

- [Next.js Docs](https://nextjs.org/docs)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 🔧 TODO після міграції

- [ ] Перевірити всі сторінки
- [ ] Налаштувати environment variables
- [ ] Підключити реальну базу даних
- [ ] Налаштувати EmailJS
- [ ] Протестувати форми
- [ ] Перевірити мобільну версію
- [ ] Деплой на Vercel

---

Створено автоматичним скриптом міграції 🚀
