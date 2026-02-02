import Link from "next/link";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <Link href="/" className={styles.logo}>
      <span className={styles.logoBud}>Буд</span>
      <span className={styles.logoLeader}>лідер</span>
    </Link>
  );
}
