"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

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
import { fetchProductsClient } from "@/lib/api/apiClient";

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

    return parsed;
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("catalogFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (searchParams.toString()) return;
    if (typeof window === "undefined") return;

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
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const breakpoint = useBreakpoint();

  const { items: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  const { favorites } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth >= 1440 && isFiltersModalOpen) {
        setIsFiltersModalOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isFiltersModalOpen]);

  const itemsPerPage = useMemo(() => {
    if (breakpoint === "mobile") return 8;
    if (breakpoint === "tablet") return 6;
    return 9;
  }, [breakpoint]);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setCurrentPage(0);
  }, [searchParams, itemsPerPage]);

  const normalizeProducts = (data: any): Product[] => {
    if (Array.isArray(data)) return data;
    if (data?.data?.products) return data.data.products;
    if (data?.products) return data.products;
    return [];
  };

  const normalizePagination = (data: any) => {
    return (
      data?.data?.pagination ||
      data?.pagination || {
        currentPage: currentPage + 1,
        totalPages: 1,
        totalItems: 0,
      }
    );
  };

  const sortParam = useMemo(() => {
    if (sortBy === "price-asc") return "price_asc";
    if (sortBy === "price-desc") return "price_desc";
    if (sortBy === "name") return "name";
    return undefined;
  }, [sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.rating !== undefined ||
    filters.inStock !== undefined ||
    filters.onSale !== undefined ||
    filters.isNew !== undefined;

  const queryParams = useMemo(() => {
    const categoriesCsv = filters.categories.length
      ? filters.categories.join(",")
      : undefined;
    const brandsCsv = filters.brands.length
      ? filters.brands.join(",")
      : undefined;
    return {
      search: searchQuery || undefined,
      categories: filters.categories.length ? filters.categories : undefined,
      category: categoriesCsv,
      categorySlug: categoriesCsv,
      categoryId: categoriesCsv,
      brands: filters.brands.length ? filters.brands : undefined,
      brand: brandsCsv,
      brandSlug: brandsCsv,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      minPrice: filters.priceMin,
      maxPrice: filters.priceMax,
      price_min: filters.priceMin,
      price_max: filters.priceMax,
      rating: filters.rating,
      inStock: filters.inStock,
      onSale: filters.onSale,
      isOnSale: filters.onSale,
      is_on_sale: filters.onSale,
      isNew: filters.isNew,
      isNewProduct: filters.isNew,
      is_new: filters.isNew,
      sort: sortParam,
      page: currentPage + 1,
      limit: itemsPerPage,
    };
  }, [
    currentPage,
    filters.brands,
    filters.categories,
    filters.inStock,
    filters.isNew,
    filters.onSale,
    filters.priceMax,
    filters.priceMin,
    filters.rating,
    itemsPerPage,
    searchQuery,
    sortParam,
  ]);

  const productsQuery = useQuery<{ products: Product[]; pagination: any }>({
    queryKey: ["catalog-products", queryParams],
    queryFn: async () => {
      console.debug("[CatalogPage] fetchProducts params", queryParams);
      const res = await fetchProductsClient(queryParams);
      let nextProducts = normalizeProducts(res);
      let nextPagination = normalizePagination(res);

      if (searchQuery && nextProducts.length === 0) {
        const fallbackParams = {
          ...queryParams,
          search: undefined,
          page: 1,
          limit: 500,
        };
        console.warn("[CatalogPage] search fallback", fallbackParams);
        const fallbackRes = await fetchProductsClient(fallbackParams);
        const fallbackProducts = normalizeProducts(fallbackRes);
        const query = searchQuery.trim().toLowerCase();
        nextProducts = fallbackProducts.filter((product) => {
          const name = product.name?.toLowerCase() || "";
          const slug = (product as any).slug?.toLowerCase() || "";
          const description = product.description?.toLowerCase() || "";
          const brand =
            typeof (product as any).brand === "string"
              ? (product as any).brand.toLowerCase()
              : (product as any).brand?.name?.toLowerCase() || "";
          return (
            name.includes(query) ||
            slug.includes(query) ||
            description.includes(query) ||
            brand.includes(query)
          );
        });
        nextPagination = {
          currentPage: 1,
          totalPages: 1,
          totalItems: nextProducts.length,
        };
        console.debug("[CatalogPage] fallback results", {
          count: nextProducts.length,
        });
      }

      const filteredProducts = nextProducts.filter((product) => {
        if (filters.categories.length) {
          const categoryValue: string | undefined =
            typeof (product as any).category === "string"
              ? (product as any).category
              : (product as any).category?.slug ||
                (product as any).category?._id ||
                (product as any).category?.id ||
                (product as any).category?.name;
          if (categoryValue && !filters.categories.includes(categoryValue))
            return false;
        }

        if (filters.brands.length) {
          const brandValue: string | undefined =
            typeof (product as any).brand === "string"
              ? (product as any).brand
              : (product as any).brand?.name ||
                (product as any).brand?.title ||
                (product as any).brand?.label;
          if (brandValue && !filters.brands.includes(brandValue)) return false;
        }

        const hasNewFlag =
          "isNewProduct" in product ||
          "isNew" in product ||
          "is_new" in product ||
          "new" in product;
        const isNewValue =
          (product as any).isNewProduct ??
          (product as any).isNew ??
          (product as any).is_new ??
          (product as any).new;
        if (filters.isNew && hasNewFlag && isNewValue !== true) return false;

        const hasSaleFlag =
          "oldPrice" in product ||
          "isOnSale" in product ||
          "onSale" in product ||
          "is_on_sale" in product;
        const isSaleValue =
          Boolean(product.oldPrice) ||
          (product as any).isOnSale === true ||
          (product as any).onSale === true ||
          (product as any).is_on_sale === true;
        if (filters.onSale && hasSaleFlag && !isSaleValue) return false;

        if (filters.inStock && product.availability !== "in_stock")
          return false;
        if (
          filters.priceMin !== undefined &&
          typeof product.price === "number" &&
          product.price < filters.priceMin
        )
          return false;
        if (
          filters.priceMax !== undefined &&
          typeof product.price === "number" &&
          product.price > filters.priceMax
        )
          return false;
        return true;
      });

      return { products: filteredProducts, pagination: nextPagination };
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!productsQuery.data) return;
    const isAppend = breakpoint !== "desktop" && currentPage > 0;
    setPagination(productsQuery.data.pagination);
    setProducts((prev) =>
      isAppend
        ? [...prev, ...productsQuery.data.products]
        : productsQuery.data.products
    );
  }, [breakpoint, currentPage, productsQuery.data]);

  const pageCount = pagination.totalPages || 1;
  const hasMoreItems = pagination.currentPage < pagination.totalPages;
  const isLoadingMore = productsQuery.isFetching && currentPage > 0;

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
    const product = products.find((p) => p._id === productId);
    if (product) setQuickOrderProduct(product);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
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
                    Знайдено{" "}
                    {hasActiveFilters
                      ? products.length
                      : pagination.totalItems || products.length}{" "}
                    товарів
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

              {products.length > 0 ? (
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
                    {products.map((product) => (
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

      {isFiltersModalOpen && (
        <div className={styles.filtersModal}>
          <button
            type="button"
            className={styles.filtersModalOverlay}
            onClick={() => setIsFiltersModalOpen(false)}
            aria-label="Закрити фільтри"
          />
          <div
            className={styles.filtersModalContent}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.filtersModalHeader}>
              <h2 className={styles.filtersModalTitle}>Фільтри</h2>
              <button
                type="button"
                onClick={() => setIsFiltersModalOpen(false)}
                className={styles.filtersModalClose}
                aria-label="Закрити"
              >
                <X className={styles.filtersModalCloseIcon} />
              </button>
            </div>
            <div className={styles.filtersModalBody}>
              <CatalogFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
            <div className={styles.filtersModalFooter}>
              <button
                type="button"
                className={styles.filtersModalApply}
                onClick={() => setIsFiltersModalOpen(false)}
              >
                Застосувати
              </button>
            </div>
          </div>
        </div>
      )}
      <QuickOrderModal
        isOpen={Boolean(quickOrderProduct)}
        onClose={() => setQuickOrderProduct(null)}
        product={quickOrderProduct}
      />
    </>
  );
}
