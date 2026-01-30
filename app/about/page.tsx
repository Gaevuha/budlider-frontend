import { Building2, Award, Users, TrendingUp } from "lucide-react";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Про нас</h1>

      <div className={styles.introCard}>
        <p className={styles.introParagraph}>
          «Будлідер» - провідний постачальник будівельних матеріалів в Україні.
          Ми працюємо на ринку більше 15 років та допомагаємо нашим клієнтам
          втілювати будівельні проєкти будь-якої складності.
        </p>
        <p className={styles.introParagraph}>
          Наша мета - забезпечити вас якісними будівельними матеріалами за
          найкращими цінами та з професійним обслуговуванням.
        </p>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className={styles.featureTitle}>15+ років досвіду</h3>
          <p className={styles.featureDescription}>
            Ми знаємо будівельний ринок та потреби наших клієнтів
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Award className="w-6 h-6 text-primary" />
          </div>
          <h3 className={styles.featureTitle}>Якість гарантована</h3>
          <p className={styles.featureDescription}>
            Працюємо тільки з перевіреними виробниками та постачальниками
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h3 className={styles.featureTitle}>10,000+ клієнтів</h3>
          <p className={styles.featureDescription}>
            Нам довіряють приватні особи та будівельні компанії
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className={styles.featureTitle}>Постійний розвиток</h3>
          <p className={styles.featureDescription}>
            Щодня розширюємо асортимент та покращуємо сервіс
          </p>
        </div>
      </div>

      <div className={styles.advantagesCard}>
        <h2 className={styles.advantagesTitle}>Наші переваги</h2>
        <ul className={styles.advantagesList}>
          <li className={styles.advantageItem}>
            <span className={styles.advantageCheckmark}>✓</span>
            <span>Широкий асортимент будівельних матеріалів</span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.advantageCheckmark}>✓</span>
            <span>Конкурентні ціни та регулярні акції</span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.advantageCheckmark}>✓</span>
            <span>Швидка доставка по всій Україні</span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.advantageCheckmark}>✓</span>
            <span>Професійна консультація наших спеціалістів</span>
          </li>
          <li className={styles.advantageItem}>
            <span className={styles.advantageCheckmark}>✓</span>
            <span>Гарантія якості на всі товари</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
