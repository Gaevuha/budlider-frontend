"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { mockProducts } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters/CatalogFilters";
import {
  SortDropdown,
  SortOption,
} from "@/components/SortDropdown/SortDropdown";
import { Pagination } from "@/components/Pagination/Pagination";
import { QuickOrderModal } from "@/components/QuickOrderModal/QuickOrderModal";
import { Loader } from "@/components/ui/loader/Loader";

import { Product, Filters } from "@/types";
import { useCart, useAddToCart, useRemoveFromCart } from "@/lib/hooks/useCart";
import { useWishlist, useToggleWishlist } from "@/lib/hooks/useWishlist";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import { useAuth } from "@/contexts/AuthContext";

import { Filter, X } from "lucide-react";
import styles from "./CatalogPage.module.css";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setSearchParams = (
    params: URLSearchParams | Record<string, any>,
    options?: { replace?: boolean }
  ) => {
    const query =
      params instanceof URLSearchParams
        ? params.toString()
        : new URLSearchParams(params).toString();
    if (options?.replace) {
      router.replace(`?${query}`);
    } else {
      router.push(`?${query}`);
    }
  };

  const filters: Filters = useMemo(() => {
    const categories = searchParams.getAll("category");
    const brands = searchParams.getAll("brand");

    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const rating = searchParams.get("rating");

    const inStock = searchParams.get("inStock");
    const onSale = searchParams.get("onSale");
    const isNew = searchParams.get("isNew");

    const parsed: Filters = {
      categories,
      brands,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      rating: rating ? Number(rating) : undefined,
      inStock: inStock === "true" ? true : undefined,
      onSale: onSale === "true" ? true : undefined,
      isNew: isNew === "true" ? true : undefined,
    };

    sessionStorage.setItem("catalogFilters", JSON.stringify(parsed));
    return parsed;
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.toString()) return;

    const saved = sessionStorage.getItem("catalogFilters");
    if (!saved) return;

    const parsed: Filters = JSON.parse(saved);
    const params = new URLSearchParams();

    parsed.categories?.forEach((c) => params.append("category", c));
    parsed.brands?.forEach((b) => params.append("brand", b));

    if (parsed.priceMin !== undefined)
      params.set("priceMin", parsed.priceMin.toString());
    if (parsed.priceMax !== undefined)
      params.set("priceMax", parsed.priceMax.toString());
    if (parsed.rating !== undefined)
      params.set("rating", parsed.rating.toString());
    if (parsed.inStock) params.set("inStock", "true");
    if (parsed.onSale) params.set("onSale", "true");
    if (parsed.isNew) params.set("isNew", "true");

    setSearchParams(params, { replace: true });
  }, [searchParams]);

  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedItems, setDisplayedItems] = useState(8);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const breakpoint = useBreakpoint();
  const { user } = useAuth();

  const { items: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  const { favorites } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const itemsPerPage = useMemo(() => {
    if (breakpoint === "mobile") return 8;
    if (breakpoint === "tablet") return 6;
    return 9;
  }, [breakpoint]);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setCurrentPage(0);
    setDisplayedItems(itemsPerPage);
  }, [searchParams, itemsPerPage]);

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length)
      result = result.filter((p) =>
        filters.categories.includes(p.category.slug)
      );

    if (filters.brands.length)
      result = result.filter((p) => filters.brands.includes(p.brand));

    if (filters.priceMin !== undefined)
      result = result.filter((p) => p.price >= filters.priceMin!);

    if (filters.priceMax !== undefined)
      result = result.filter((p) => p.price <= filters.priceMax!);

    if (filters.rating !== undefined)
      result = result.filter((p) => p.rating >= filters.rating!);

    if (filters.inStock)
      result = result.filter((p) => p.availability === "in_stock");

    if (filters.onSale)
      result = result.filter((p) => p.oldPrice && p.oldPrice > 0);

    if (filters.isNew) result = result.filter((p) => p.isNewProduct === true);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name")
      result.sort((a, b) => a.name.localeCompare(b.name, "uk"));

    return result;
  }, [filters, sortBy, searchQuery]);

  const displayProducts = useMemo(() => {
    if (breakpoint === "desktop") {
      const start = currentPage * itemsPerPage;
      return filteredProducts.slice(start, start + itemsPerPage);
    }
    return filteredProducts.slice(0, displayedItems);
  }, [breakpoint, filteredProducts, currentPage, itemsPerPage, displayedItems]);

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const hasMoreItems = displayedItems < filteredProducts.length;

  const handleFiltersChange = (newFilters: Filters) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);

    newFilters.categories.forEach((c) => params.append("category", c));
    newFilters.brands.forEach((b) => params.append("brand", b));

    if (newFilters.priceMin !== undefined)
      params.set("priceMin", newFilters.priceMin.toString());
    if (newFilters.priceMax !== undefined)
      params.set("priceMax", newFilters.priceMax.toString());
    if (newFilters.rating !== undefined)
      params.set("rating", newFilters.rating.toString());
    if (newFilters.inStock) params.set("inStock", "true");
    if (newFilters.onSale) params.set("onSale", "true");
    if (newFilters.isNew) params.set("isNew", "true");

    sessionStorage.setItem("catalogFilters", JSON.stringify(newFilters));
    setSearchParams(params, { replace: true });
  };

  const handleAddToCart = (id: string) => {
    const exists = cartItems.some((i) => i.productId === id);
    exists
      ? removeFromCart.mutate(id)
      : addToCart.mutate({ productId: id, quantity: 1 });
  };

  const handleToggleFavorite = (id: string) => toggleWishlist.mutate(id);

  const handleQuickOrder = (productId: string) => {
    const product = mockProducts.find((p) => p._id === productId);
    if (product) setQuickOrderProduct(product);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedItems((prev) => prev + itemsPerPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const handlePageChange = ({ selected }: { selected: number }) =>
    setCurrentPage(selected);

  return (
    <>
      <section className={styles.catalogSection}>
        <div className="container">
          <div className={styles.catalogLayout}>
            <aside className={styles.filtersAside}>
              <CatalogFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </aside>

            <div className={styles.productsContent}>
              {/* Header */}
              <div className={styles.catalogHeader}>
                <div>
                  <h1 className={styles.catalogTitle}>Каталог товарів</h1>
                  {searchQuery && (
                    <p className={styles.searchInfo}>
                      Результати пошуку за запитом:{" "}
                      <span className={styles.searchQuery}>
                        "{searchQuery}"
                      </span>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          sessionStorage.removeItem("catalogFilters");
                          setSearchParams({}, { replace: true });
                        }}
                        className={styles.cancelSearch}
                      >
                        Скасувати пошук
                      </button>
                    </p>
                  )}
                  <p className={styles.productsCount}>
                    Знайдено {filteredProducts.length} товарів
                  </p>
                </div>
                <div className={styles.headerActions}>
                  <button
                    onClick={() => setIsFiltersModalOpen(true)}
                    className={styles.filtersButton}
                  >
                    <Filter className={styles.filtersIcon} />
                    <span>Фільтри</span>
                  </button>

                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <>
                  {breakpoint === "desktop" && pageCount > 1 && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}

                  <ul className={styles.productsGrid}>
                    {displayProducts.map((product) => (
                      <li key={product._id}>
                        <ProductCard
                          product={product}
                          isFavorite={favorites.includes(product._id)}
                          isInCart={cartItems.some(
                            (item) => item.productId === product._id
                          )}
                          onAddToCart={handleAddToCart}
                          onToggleFavorite={handleToggleFavorite}
                          onQuickOrder={handleQuickOrder}
                        />
                      </li>
                    ))}
                  </ul>

                  {breakpoint !== "desktop" && hasMoreItems && (
                    <div className={styles.loadMoreContainer}>
                      {isLoadingMore ? (
                        <Loader />
                      ) : (
                        <button
                          onClick={handleLoadMore}
                          className={styles.loadMoreButton}
                        >
                          Переглянути ще
                        </button>
                      )}
                    </div>
                  )}

                  {breakpoint === "desktop" && pageCount > 1 && (
                    <div className={styles.paginationContainer}>
                      <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noResults}>
                  <p className={styles.noResultsMessage}>
                    За вашим запитом нічого не знайдено
                  </p>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("catalogFilters");
                      setSearchParams({}, { replace: true });
                    }}
                    className={styles.resetFiltersButton}
                  >
                    Скинути фільтри
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QuickOrderModal та FiltersModal залишаються без змін */}
      {/* ... */}
    </>
  );
}
