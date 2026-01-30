#!/usr/bin/env node

/**
 * 🚀 Автоматичний скрипт міграції "Будлідер" на Next.js 14+ App Router
 *
 * Використання:
 * 1. Експортуйте проєкт з Figma Make
 * 2. Розпакуйте ZIP
 * 3. Запустіть: node migrate-to-nextjs.js
 */

import fs from "fs";
import path from "path";
import process from "process";

// Кольори для консолі
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Конфігурація шляхів
const PATHS = {
  src: "./src",
  app: "./src/app",
  newApp: "./app",
  components: "./components",
  lib: "./lib",
  hooks: "./hooks",
  store: "./store",
  types: "./types",
  data: "./data",
  providers: "./providers",
  styles: "./styles",
  public: "./public",
};

// Крок 1: Створення структури папок
function createDirectories() {
  log("\n📁 Створення структури папок Next.js...", "blue");

  const dirs = [
    PATHS.newApp,
    `${PATHS.newApp}/about`,
    `${PATHS.newApp}/catalog`,
    `${PATHS.newApp}/product/[slug]`,
    `${PATHS.newApp}/cart`,
    `${PATHS.newApp}/checkout`,
    `${PATHS.newApp}/profile`,
    `${PATHS.newApp}/wishlist`,
    `${PATHS.newApp}/admin/orders`,
    `${PATHS.newApp}/admin/users`,
    `${PATHS.newApp}/delivery`,
    `${PATHS.newApp}/services`,
    `${PATHS.newApp}/contacts`,
    `${PATHS.newApp}/api/users`,
    `${PATHS.newApp}/api/reviews`,
    `${PATHS.newApp}/api/orders`,
    PATHS.components,
    PATHS.lib,
    PATHS.hooks,
    PATHS.store,
    PATHS.types,
    PATHS.data,
    PATHS.providers,
    PATHS.styles,
    PATHS.public,
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`  ✅ ${dir}`, "green");
    }
  });
}

// Крок 2: Конвертація імпортів React Router → Next.js
function convertImports(content) {
  // Link
  content = content.replace(
    /import\s*{\s*Link\s*}\s*from\s*['"]react-router-dom['"]/g,
    "import Link from 'next/link'"
  );

  // useNavigate → useRouter
  content = content.replace(
    /import\s*{\s*([^}]*useNavigate[^}]*)\s*}\s*from\s*['"]react-router-dom['"]/g,
    "import { useRouter } from 'next/navigation'"
  );

  content = content.replace(/useNavigate\(\)/g, "useRouter()");
  content = content.replace(/navigate\(/g, "router.push(");

  // useParams → params prop
  content = content.replace(
    /import\s*{\s*([^}]*useParams[^}]*)\s*}\s*from\s*['"]react-router-dom['"]/g,
    ""
  );

  // Link to → href
  content = content.replace(/to=/g, "href=");

  // @/ alias для імпортів
  content = content.replace(/from\s+['"]\.\.\/(app\/)/g, "from '@/");

  content = content.replace(/from\s+['"]@\/app\//g, "from '@/");

  return content;
}

// Крок 3: Додавання 'use client' для Client Components
function addUseClient(content, filename) {
  const clientIndicators = [
    "useState",
    "useEffect",
    "useContext",
    "onClick",
    "onChange",
    "onSubmit",
    "localStorage",
    "window.",
    "document.",
  ];

  const needsUseClient = clientIndicators.some((indicator) =>
    content.includes(indicator)
  );

  if (needsUseClient && !content.startsWith("'use client'")) {
    return "'use client';\n\n" + content;
  }

  return content;
}

// Крок 4: Копіювання та конвертація файлів
function copyAndConvert(srcPath, destPath, convertFunc) {
  if (!fs.existsSync(srcPath)) {
    log(`  ⚠️  Файл не знайдено: ${srcPath}`, "yellow");
    return;
  }

  let content = fs.readFileSync(srcPath, "utf8");

  if (convertFunc) {
    content = convertFunc(content, path.basename(srcPath));
  }

  fs.writeFileSync(destPath, content);
  log(`  ✅ ${srcPath} → ${destPath}`, "green");
}

// Крок 5: Міграція сторінок
function migratePages() {
  log("\n📄 Міграція сторінок...", "blue");

  const pages = [
    { src: "", dest: "", route: "/" }, // Root page
    { src: "about", dest: "about", route: "/about" },
    { src: "catalog", dest: "catalog", route: "/catalog" },
    { src: "product/[slug]", dest: "product/[slug]", route: "/product/[slug]" },
    { src: "cart", dest: "cart", route: "/cart" },
    { src: "checkout", dest: "checkout", route: "/checkout" },
    { src: "profile", dest: "profile", route: "/profile" },
    { src: "wishlist", dest: "wishlist", route: "/wishlist" },
    { src: "admin/orders", dest: "admin/orders", route: "/admin/orders" },
    { src: "admin/users", dest: "admin/users", route: "/admin/users" },
    { src: "delivery", dest: "delivery", route: "/delivery" },
    { src: "services", dest: "services", route: "/services" },
    { src: "contacts", dest: "contacts", route: "/contacts" },
  ];

  pages.forEach((page) => {
    const srcDir = path.join(PATHS.app, page.src);
    const destDir = path.join(PATHS.newApp, page.dest);

    // Перевіряємо чи існує папка
    if (!fs.existsSync(srcDir)) {
      log(`  ⚠️  Папка не знайдена: ${srcDir}`, "yellow");
      return;
    }

    // Створюємо папку призначення
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Копіюємо ВСІ .tsx та .css файли з папки
    const files = fs.readdirSync(srcDir);
    files.forEach((file) => {
      const srcFilePath = path.join(srcDir, file);
      const destFilePath = path.join(destDir, file);

      // Пропускаємо папки
      if (fs.statSync(srcFilePath).isDirectory()) {
        return;
      }

      // Копіюємо .tsx файли з конвертацією
      if (file.endsWith(".tsx")) {
        copyAndConvert(srcFilePath, destFilePath, (content, filename) => {
          content = convertImports(content);
          content = addUseClient(content, filename);
          return content;
        });
      }
      // Копіюємо .css файли без змін
      else if (file.endsWith(".css")) {
        copyAndConvert(srcFilePath, destFilePath);
      }
    });
  });
}

// Крок 6: Копіювання компонентів
function copyComponents() {
  log("\n🧩 Копіювання компонентів...", "blue");

  const srcComponents = path.join(PATHS.app, "components");
  const destComponents = PATHS.components;

  if (!fs.existsSync(srcComponents)) {
    log("  ⚠️  Папка components не знайдена", "yellow");
    return;
  }

  // Рекурсивна функція для копіювання папок
  function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;

    // Створюємо папку призначення
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);

    items.forEach((item) => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        // Рекурсивно копіюємо підпапки
        copyDirectory(srcPath, destPath);
      } else if (
        item.endsWith(".tsx") ||
        item.endsWith(".css") ||
        item.endsWith(".ts")
      ) {
        // Копіюємо файли
        let content = fs.readFileSync(srcPath, "utf8");

        if (item.endsWith(".tsx") || item.endsWith(".ts")) {
          content = convertImports(content);
          content = addUseClient(content, item);
        }

        fs.writeFileSync(destPath, content);
        log(`  ✅ ${srcPath} → ${destPath}`, "green");
      }
    });
  }

  copyDirectory(srcComponents, destComponents);
}

// Крок 7: Міграція hooks, store, types, data
function migrateOtherDirs() {
  log("\n🔧 Міграція hooks, store, types, data...", "blue");

  const dirs = ["hooks", "store", "types", "data"];

  dirs.forEach((dirName) => {
    const srcDir = path.join(PATHS.app, dirName);
    const destDir = `./${dirName}`;

    if (!fs.existsSync(srcDir)) {
      log(`  ⚠️  Папка ${dirName} не знайдена`, "yellow");
      return;
    }

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = fs.readdirSync(srcDir);
    files.forEach((file) => {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      if (fs.statSync(srcPath).isFile()) {
        copyAndConvert(srcPath, destPath, (content) => {
          return convertImports(content);
        });
      }
    });
  });
}

// Крок 8: Міграція стилів
function migrateStyles() {
  log("\n🎨 Міграція стилів...", "blue");

  const srcStyles = path.join(PATHS.src, "styles");

  if (!fs.existsSync(srcStyles)) {
    log("  ⚠️  Папка styles не знайдена", "yellow");
    return;
  }

  if (!fs.existsSync(PATHS.styles)) {
    fs.mkdirSync(PATHS.styles, { recursive: true });
  }

  // Копіюємо всі CSS файли
  const styleFiles = fs.readdirSync(srcStyles);
  styleFiles.forEach((file) => {
    if (file.endsWith(".css")) {
      const srcPath = path.join(srcStyles, file);
      const destPath = path.join(PATHS.styles, file);
      copyAndConvert(srcPath, destPath);
    }
  });

  // Перейменовуємо index.css → globals.css
  const indexCss = path.join(PATHS.styles, "index.css");
  const globalsCss = path.join(PATHS.styles, "globals.css");

  if (fs.existsSync(indexCss)) {
    fs.renameSync(indexCss, globalsCss);
    log(`  ✅ index.css → globals.css`, "green");
  }
}

// Крок 9: Створення layout.tsx
function createLayout() {
  log("\n📐 Створення Root Layout...", "blue");

  const layoutContent = `import type { Metadata } from 'next';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Providers } from '@/providers/Providers';
import '@/styles/globals.css';
import '@/styles/fonts.css';
import '@/styles/theme.css';

export const metadata: Metadata = {
  title: 'Будлідер - Інтернет-магазин будівельних матеріалів',
  description: 'Якісні будівельні матеріали з доставкою по всій Україні',
  keywords: 'будівельні матеріали, цемент, цегла, інструменти, Україна',
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
`;

  fs.writeFileSync(path.join(PATHS.newApp, "layout.tsx"), layoutContent);
  log("  ✅ app/layout.tsx створено", "green");
}

// Крок 10: Створення Providers
function createProviders() {
  log("\n⚙️  Створення Providers...", "blue");

  if (!fs.existsSync(PATHS.providers)) {
    fs.mkdirSync(PATHS.providers, { recursive: true });
  }

  // QueryProvider
  const queryProviderContent = `'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
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
`;

  fs.writeFileSync(
    path.join(PATHS.providers, "QueryProvider.tsx"),
    queryProviderContent
  );
  log("  ✅ providers/QueryProvider.tsx", "green");

  // AuthProvider (копіюємо з contexts якщо є)
  const srcAuthContext = path.join(PATHS.app, "contexts/AuthContext.tsx");
  const destAuthProvider = path.join(PATHS.providers, "AuthProvider.tsx");

  if (fs.existsSync(srcAuthContext)) {
    copyAndConvert(srcAuthContext, destAuthProvider, (content) => {
      content = convertImports(content);
      content = "'use client';\n\n" + content;
      return content;
    });
  }

  // Providers (комбінований)
  const providersContent = `'use client';

import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
`;

  fs.writeFileSync(
    path.join(PATHS.providers, "Providers.tsx"),
    providersContent
  );
  log("  ✅ providers/Providers.tsx", "green");
}

// Крок 11: Створення API Routes
function createAPIRoutes() {
  log("\n🔌 Створення API Routes...", "blue");

  // API Users
  const usersRouteContent = `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');
  
  // TODO: Підключити до реальної бази даних
  const users = [
    { id: '1', name: 'User 1', email: 'user1@test.com', role: 'user' },
    { id: '2', name: 'Admin', email: 'admin@test.com', role: 'admin' },
  ];
  
  const filteredUsers = role 
    ? users.filter(user => user.role === role)
    : users;
  
  return NextResponse.json(filteredUsers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // TODO: Зберегти користувача в базу даних
  
  return NextResponse.json({ success: true, id: Date.now().toString() }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  
  // TODO: Оновити користувача в базі даних
  
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  // TODO: Видалити користувача з бази даних
  
  return NextResponse.json({ success: true });
}
`;

  fs.writeFileSync(
    path.join(PATHS.newApp, "api/users/route.ts"),
    usersRouteContent
  );
  log("  ✅ app/api/users/route.ts", "green");

  // API Reviews
  const reviewsRouteContent = `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('productId');
  
  // TODO: Отримати відгуки з бази даних
  const reviews = [];
  
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const review = await request.json();
  
  // TODO: Зберегти відгук у базі даних
  
  return NextResponse.json({ success: true, id: Date.now().toString() }, { status: 201 });
}
`;

  fs.writeFileSync(
    path.join(PATHS.newApp, "api/reviews/route.ts"),
    reviewsRouteContent
  );
  log("  ✅ app/api/reviews/route.ts", "green");

  // API Orders
  const ordersRouteContent = `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  // TODO: Отримати замовлення з бази даних
  const orders = [];
  
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const order = await request.json();
  
  // TODO: Зберегти замовлення у базі даних
  
  return NextResponse.json({ success: true, id: Date.now().toString() }, { status: 201 });
}
`;

  fs.writeFileSync(
    path.join(PATHS.newApp, "api/orders/route.ts"),
    ordersRouteContent
  );
  log("  ✅ app/api/orders/route.ts", "green");
}

// Крок 12: Створення конфігурацій
function createConfigs() {
  log("\n⚙️  Створення конфігурацій...", "blue");

  // next.config.mjs
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
`;

  fs.writeFileSync("./next.config.mjs", nextConfig);
  log("  ✅ next.config.mjs", "green");

  // tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      jsx: "preserve",
      module: "ESNext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      allowJs: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      incremental: true,
      paths: {
        "@/*": ["./*"],
      },
      plugins: [
        {
          name: "next",
        },
      ],
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  };

  fs.writeFileSync("./tsconfig.json", JSON.stringify(tsConfig, null, 2));
  log("  ✅ tsconfig.json", "green");

  // package.json (оновлення скриптів)
  if (fs.existsSync("./package.json")) {
    const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

    packageJson.scripts = {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      "type-check": "tsc --noEmit",
    };

    // Додаємо Next.js залежності
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies.next = "^14.2.0";
    packageJson.dependencies.react = "^18.3.1";
    packageJson.dependencies["react-dom"] = "^18.3.1";

    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies["@types/node"] = "^20";
    packageJson.devDependencies["@types/react"] = "^18";
    packageJson.devDependencies["@types/react-dom"] = "^18";
    packageJson.devDependencies.typescript = "^5";

    // Видаляємо Vite та React Router
    delete packageJson.dependencies["react-router-dom"];
    delete packageJson.devDependencies["vite"];
    delete packageJson.devDependencies["@vitejs/plugin-react"];
    delete packageJson.devDependencies["@tailwindcss/vite"];

    fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
    log("  ✅ package.json оновлено", "green");
  }

  // .env.local (приклад)
  const envContent = `# Next.js Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
`;

  fs.writeFileSync("./.env.local", envContent);
  log("  ✅ .env.local", "green");
}

// Крок 13: Створення middleware
function createMiddleware() {
  log("\n🛡️  Створення Middleware...", "blue");

  const middlewareContent = `import { NextResponse } from 'next/server';
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
`;

  fs.writeFileSync("./middleware.ts", middlewareContent);
  log("  ✅ middleware.ts", "green");
}

// Крок 14: Очистка старих файлів
function cleanup() {
  log("\n🧹 Очистка старих файлів...", "blue");

  const filesToRemove = [
    "./index.html",
    "./vite.config.ts",
    "./src/main.tsx",
    "./src/app/App.tsx",
    "./src/app/Routes.tsx",
  ];

  filesToRemove.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      log(`  🗑️  ${file}`, "yellow");
    }
  });

  // Видаляємо стару папку src (опціонально)
  log("\n  ℹ️  Стара папка src/ залишена для резервної копії", "blue");
  log("  ℹ️  Ви можете видалити її вручну після перевірки", "blue");
}

// Крок 15: Створення README для Next.js
function createReadme() {
  log("\n📝 Створення README...", "blue");

  const readmeContent = `# Будлідер - Next.js 14+

## 🚀 Запуск проєкту

\`\`\`bash
# Встановлення залежностей
npm install

# Запуск dev сервера
npm run dev

# Білд для продакшн
npm run build

# Запуск продакшн сервера
npm start
\`\`\`

## 📁 Структура проєкту

\`\`\`
app/           - Next.js App Router (сторінки)
components/    - React компоненти
lib/           - Утиліти та хелпери
hooks/         - Custom React hooks
store/         - Zustand stores
types/         - TypeScript types
data/          - Mock data
providers/     - Context providers
styles/        - Глобальні стилі
\`\`\`

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
`;

  fs.writeFileSync("./README-NEXTJS.md", readmeContent);
  log("  ✅ README-NEXTJS.md", "green");
}

// Головна функція
async function main() {
  log("\n🚀 АВТОМАТИЧНА МІГРАЦІЯ НА NEXT.JS 14+", "green");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "green");

  try {
    createDirectories();
    createLayout();
    createProviders();
    migratePages();
    copyComponents();
    migrateOtherDirs();
    migrateStyles();
    createAPIRoutes();
    createConfigs();
    createMiddleware();
    createReadme();
    cleanup();

    log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "green");
    log("✅ МІГРАЦІЯ ЗАВЕРШЕНА!", "green");
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n", "green");

    log("📋 Наступні кроки:", "blue");
    log("  1. Встановіть залежності: npm install", "yellow");
    log("  2. Запустіть dev сервер: npm run dev", "yellow");
    log("  3. Відкрийте http://localhost:3000", "yellow");
    log("  4. Перевірте всі сторінки", "yellow");
    log("  5. Прочитайте README-NEXTJS.md\n", "yellow");
  } catch (error) {
    log("\n❌ ПОМИЛКА ПІД ЧАС МІГРАЦІЇ:", "red");
    console.error(error);
    process.exit(1);
  }
}

// Запуск
main();
