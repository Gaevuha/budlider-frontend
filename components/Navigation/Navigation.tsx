"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li>
          <Link
            href="/catalog"
            className={`${styles.navLink} ${
              isActive("/catalog") ? styles.activeNavLink : ""
            }`}
          >
            Каталог
          </Link>
        </li>

        <li>
          <Link
            href="/services"
            className={`${styles.navLink} ${
              isActive("/services") ? styles.activeNavLink : ""
            }`}
          >
            Послуги
          </Link>
        </li>

        <li>
          <Link
            href="/about"
            className={`${styles.navLink} ${
              isActive("/about") ? styles.activeNavLink : ""
            }`}
          >
            Про нас
          </Link>
        </li>

        <li>
          <Link
            href="/delivery"
            className={`${styles.navLink} ${
              isActive("/delivery") ? styles.activeNavLink : ""
            }`}
          >
            Доставка
          </Link>
        </li>

        <li>
          <Link
            href="/contacts"
            className={`${styles.navLink} ${
              isActive("/contacts") ? styles.activeNavLink : ""
            }`}
          >
            Контакти
          </Link>
        </li>
      </ul>
    </nav>
  );
}
