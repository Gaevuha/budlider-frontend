'use client';

import styles from './SortDropdown.module.css';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className={styles.sortingWrapper}>
      <label htmlFor="sort" className={styles.sortingLabel}>
        Сортування:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={styles.sortingSelect}
      >
        <option value="default">За замовчуванням</option>
        <option value="price-asc">Ціна: зростання</option>
        <option value="price-desc">Ціна: спадання</option>
        <option value="name">За назвою</option>
      </select>
    </div>
  );
}
