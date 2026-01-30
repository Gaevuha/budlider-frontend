// app/components/Header/Header.tsx
import { cookies } from "next/headers";
import { HeaderClient } from "./HeaderСlient";

export async function Header() {
  const cookieStore = await cookies();

  // Отримуємо дані з cookies на сервері
  const cartCookie = cookieStore.get("cart");
  const favoritesCookie = cookieStore.get("favorites");
  const searchCookie = cookieStore.get("search");

  const cartItemsCount = cartCookie
    ? JSON.parse(cartCookie.value).items?.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ) || 0
    : 0;

  const favoritesCount = favoritesCookie
    ? JSON.parse(favoritesCookie.value).length
    : 0;

  const initialSearchQuery = searchCookie?.value || "";

  return (
    <HeaderClient
      initialCartItemsCount={cartItemsCount}
      initialFavoritesCount={favoritesCount}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
