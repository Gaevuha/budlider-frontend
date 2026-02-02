import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  variant: "desktop" | "mobile";
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  variant,
}: SearchBarProps) {
  // Тепер ми не потребуємо окремих класів для mobile/desktop
  // Обидва варіанти використовують однакові стилі
  const className =
    variant === "desktop" ? styles.desktopSearch : styles.mobileSearch;

  return (
    <form onSubmit={handleSearch} className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Пошук товарів..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton} aria-label="Пошук">
        <Search className={styles.searchIcon} />
      </button>
    </form>
  );
}
