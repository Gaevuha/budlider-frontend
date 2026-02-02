"use client";

import { Filters } from "@/types";
import { useState, useEffect } from "react";
import { fetchCategoriesClient, fetchBrandsClient } from "@/lib/api/apiClient";
import { X } from "lucide-react";
import styles from "./CatalogFilters.module.css";

interface CatalogFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function CatalogFilters({
  filters,
  onFiltersChange,
}: CatalogFiltersProps) {
  const [priceMin, setPriceMin] = useState<string>(
    filters.priceMin?.toString() || ""
  );
  const [priceMax, setPriceMax] = useState<string>(
    filters.priceMax?.toString() || ""
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  console.log("CatalogFilters rendered with filters:", filters);

  // Синхронізація локальних станів ціни з зовнішніми фільтрами
  useEffect(() => {
    setPriceMin(filters.priceMin?.toString() || "");
    setPriceMax(filters.priceMax?.toString() || "");
  }, [filters.priceMin, filters.priceMax]);

  useEffect(() => {
    let isMounted = true;

    const normalizeList = (data: any) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      if (Array.isArray(data?.data?.categories)) return data.data.categories;
      if (Array.isArray(data?.categories)) return data.categories;
      if (Array.isArray(data?.data?.brands)) return data.data.brands;
      if (Array.isArray(data?.brands)) return data.brands;
      if (Array.isArray(data?.data?.items)) return data.data.items;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.data?.results)) return data.data.results;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.data?.list)) return data.data.list;
      if (Array.isArray(data?.list)) return data.list;
      return [];
    };

    const normalizeCategories = (list: any[]) =>
      list
        .map((category) => {
          const name =
            category?.name ||
            category?.title ||
            category?.label ||
            category?.categoryName ||
            "";
          const slug = category?.slug || category?.id || category?._id || name;
          return {
            ...category,
            name,
            slug,
          };
        })
        .filter(
          (category) => Boolean(category?.name) && Boolean(category?.slug)
        );

    const normalizeBrands = (list: any[]) =>
      list
        .map((brand) => {
          if (typeof brand === "string") return brand;
          return (
            brand?.name ||
            brand?.title ||
            brand?.label ||
            brand?.brand ||
            brand?.slug ||
            brand?.id ||
            brand?._id ||
            ""
          );
        })
        .filter((brand) => Boolean(brand));

    const load = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetchCategoriesClient(),
          fetchBrandsClient(),
        ]);
        if (!isMounted) return;
        const categoriesList = normalizeCategories(
          normalizeList(categoriesRes)
        );
        const brandsList = normalizeBrands(normalizeList(brandsRes));
        setCategories(categoriesList);
        setBrands(brandsList);
        if (categoriesList.length === 0 || brandsList.length === 0) {
          console.warn("[CatalogFilters] empty lists", {
            categoriesRes,
            brandsRes,
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setCategories([]);
        setBrands([]);
        console.error("[CatalogFilters] load failed", error);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleCategory = (categorySlug: string) => {
    console.log("toggleCategory called:", categorySlug);
    const newCategories = filters.categories.includes(categorySlug)
      ? filters.categories.filter((c) => c !== categorySlug)
      : [...filters.categories, categorySlug];
    const newFilters = { ...filters, categories: newCategories };
    console.log("Calling onFiltersChange with:", newFilters);
    onFiltersChange(newFilters);
  };

  const toggleBrand = (brand: string) => {
    console.log("toggleBrand called:", brand);
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: newBrands };
    console.log("Calling onFiltersChange with:", newFilters);
    onFiltersChange(newFilters);
  };

  const applyPriceFilter = () => {
    onFiltersChange({
      ...filters,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
    });
  };

  const clearFilters = () => {
    console.log("🧹 clearFilters called");
    setPriceMin("");
    setPriceMax("");

    // Очищаємо sessionStorage
    sessionStorage.removeItem("catalogFilters");

    onFiltersChange({
      categories: [],
      brands: [],
      priceMin: undefined,
      priceMax: undefined,
      rating: undefined,
      inStock: undefined,
      onSale: undefined,
      isNew: undefined,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.rating !== undefined ||
    filters.inStock !== undefined ||
    filters.onSale !== undefined ||
    filters.isNew !== undefined;

  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <h2 className={styles.title}>Фільтри</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>
            <X className={styles.clearIcon} />
            <span>Скинути</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Категорії</h3>
        <div className={styles.checkboxList}>
          {categories.map((category) => (
            <label
              key={category.slug}
              htmlFor={`category-${category.slug}`}
              className={styles.checkboxLabel}
            >
              <input
                id={`category-${category.slug}`}
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Бренди</h3>
        <div className={styles.checkboxList}>
          {brands.map((brand) => (
            <label
              key={brand}
              htmlFor={`brand-${brand}`}
              className={styles.checkboxLabel}
            >
              <input
                id={`brand-${brand}`}
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ціна (грн)</h3>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Від"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className={styles.priceInput}
          />
          <input
            type="number"
            placeholder="До"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className={styles.priceInput}
          />
        </div>
        <button onClick={applyPriceFilter} className={styles.applyButton}>
          Застосувати
        </button>
      </div>

      {/* Other filters */}
      <div className={styles.otherFilters}>
        <label htmlFor="filter-inStock" className={styles.checkboxLabel}>
          <input
            id="filter-inStock"
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                inStock: e.target.checked ? true : undefined,
              })
            }
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>В наявності</span>
        </label>
        <label htmlFor="filter-onSale" className={styles.checkboxLabel}>
          <input
            id="filter-onSale"
            type="checkbox"
            checked={filters.onSale || false}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                onSale: e.target.checked ? true : undefined,
              })
            }
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>Акції</span>
        </label>
        <label htmlFor="filter-isNew" className={styles.checkboxLabel}>
          <input
            id="filter-isNew"
            type="checkbox"
            checked={filters.isNew || false}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                isNew: e.target.checked ? true : undefined,
              })
            }
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>Новинки</span>
        </label>
      </div>
    </aside>
  );
}
