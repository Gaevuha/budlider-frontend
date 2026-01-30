import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Навігація */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Навігація</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/catalog">Каталог</Link></li>
              <li><Link href="/services">Послуги</Link></li>
              <li><Link href="/about">Про нас</Link></li>
              <li><Link href="/delivery">Доставка та оплата</Link></li>
            </ul>
          </div>

          {/* Контакти */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Контакти</h4>
            <ul className={styles.footerContacts}>
              <li>
                <Phone className="w-4 h-4" />
                <a href="tel:+380441234567">+380 (44) 123-45-67</a>
              </li>
              <li>
                <Mail className="w-4 h-4" />
                <a href="mailto:info@budlider.ua">info@budlider.ua</a>
              </li>
              <li>
                <MapPin className="w-4 h-4" />
                <span>м. Київ, вул. Будівельна, 123</span>
              </li>
            </ul>
          </div>

          {/* Логотип */}
          <div className={styles.footerColumn}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoBud}>Буд</span>
              <span className={styles.logoLeader}>лідер</span>
            </Link>
            <p className={styles.footerText}>
              Провідний постачальник будівельних матеріалів в Україні з 2008 року
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Будлідер. Всі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
}