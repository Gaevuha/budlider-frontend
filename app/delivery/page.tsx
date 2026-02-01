import { Truck, MapPin, Clock, CreditCard } from "lucide-react";
import styles from "./DeliveryPage.module.css";

export default function DeliveryPage() {
  return (
    <div className={`${styles.container} container`}>
      <h1 className={styles.title}>Доставка та оплата</h1>

      {/* Доставка */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Truck className="w-8 h-8 text-primary" />
          <h2 className={styles.sectionTitle}>Способи доставки</h2>
        </div>

        <div className={styles.optionsList}>
          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Кур'єрська доставка по місту</h3>
            <p className={styles.optionDescription}>
              Доставка по Києву та в межах 50 км від міста. Наш кур'єр привезе
              замовлення за вказаною адресою у зручний для вас час.
            </p>
            <div className={styles.optionInfo}>
              <Clock className="w-5 h-5" />
              <span>1-2 робочих дні</span>
            </div>
            <p className={styles.optionPrice}>
              Вартість: від 150 грн (безкоштовно при замовленні від 5000 грн)
            </p>
          </div>

          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Доставка Новою Поштою</h3>
            <p className={styles.optionDescription}>
              Відправляємо замовлення у будь-яке місто України через службу Нова
              Пошта. Ви можете отримати товар у відділенні або замовити адресну
              доставку.
            </p>
            <div className={styles.optionInfo}>
              <Clock className="w-5 h-5" />
              <span>2-4 робочих дні</span>
            </div>
            <p className={styles.optionPrice}>
              Вартість: за тарифами Нової Пошти
            </p>
          </div>

          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Доставка Укрпоштою</h3>
            <p className={styles.optionDescription}>
              Надсилаємо посилки через Укрпошту у будь-який населений пункт
              України. Отримання у відділенні або поштоматі за вашим вибором.
            </p>
            <div className={styles.optionInfo}>
              <Clock className="w-5 h-5" />
              <span>3-7 робочих днів</span>
            </div>
            <p className={styles.optionPrice}>Вартість: за тарифами Укрпошти</p>
          </div>

          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Доставка Укртелекомом</h3>
            <p className={styles.optionDescription}>
              Швидка та надійна доставка через службу Укртелеком. Зручна мережа
              відділень та поштоматів по всій Україні.
            </p>
            <div className={styles.optionInfo}>
              <Clock className="w-5 h-5" />
              <span>2-5 робочих днів</span>
            </div>
            <p className={styles.optionPrice}>
              Вартість: за тарифами Укртелекому
            </p>
          </div>

          <div className={styles.optionCard}>
            <h3 className={styles.optionTitle}>Самовивіз зі складу</h3>
            <p className={styles.optionDescription}>
              Ви можете забрати замовлення самостійно з нашого складу.
              Попередньо узгодьте час візиту з нашим менеджером.
            </p>
            <div className={styles.optionInfo}>
              <MapPin className="w-5 h-5" />
              <span>м. Київ, вул. Будівельна, 123</span>
            </div>
            <p className={styles.optionPrice}>Безкоштовно</p>
          </div>
        </div>
      </div>

      {/* Оплата */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <CreditCard className="w-8 h-8 text-primary" />
          <h2 className={styles.sectionTitle}>Способи оплати</h2>
        </div>

        <div className={styles.paymentGrid}>
          <div className={styles.paymentCard}>
            <h3 className={styles.paymentTitle}>Готівка</h3>
            <p className={styles.paymentDescription}>
              Оплата готівкою при отриманні товару кур'єру або на складі
              самовивозу
            </p>
          </div>

          <div className={styles.paymentCard}>
            <h3 className={styles.paymentTitle}>Карткою онлайн</h3>
            <p className={styles.paymentDescription}>
              Безготівкова оплата банківською карткою через безпечний платіжний
              шлюз
            </p>
          </div>

          <div className={styles.paymentCard}>
            <h3 className={styles.paymentTitle}>Безготівковий розрахунок</h3>
            <p className={styles.paymentDescription}>
              Оплата за рахунком для юридичних осіб та ФОП
            </p>
          </div>

          <div className={styles.paymentCard}>
            <h3 className={styles.paymentTitle}>Накладений платіж</h3>
            <p className={styles.paymentDescription}>
              Оплата при отриманні посилки у відділенні Нової Пошти
            </p>
          </div>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h3 className={styles.infoTitle}>Важлива інформація</h3>
        <ul className={styles.infoList}>
          <li>
            • Доставка великогабаритних товарів обговорюється індивідуально
          </li>
          <li>
            • При отриманні товару обов'язково перевірте його комплектність та
            цілісність
          </li>
          <li>• Зберігайте товарний чек та гарантійний талон</li>
          <li>
            • Повернення та обмін товару здійснюється згідно Закону про захист
            прав споживачів
          </li>
        </ul>
      </div>
    </div>
  );
}
