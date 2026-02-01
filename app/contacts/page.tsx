"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "@/lib/utils/toast";
import styles from "./ContactsPage.module.css";

export default function ContactsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const templateParams = {
      from_name: formData.get("name"),
      from_phone: formData.get("phone"),
      from_email: formData.get("email"),
      message: formData.get("message"),
      to_email: "topgan1950@gmail.com",
    };

    try {
      // Для роботи EmailJS потрібно зареєструватися на https://www.emailjs.com/
      // і отримати Service ID, Template ID та Public Key
      // Поки що показуємо успішне повідомлення

      // Приклад використання EmailJS (розкоментуйте після налаштування):
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID',
      //   templateParams,
      //   'YOUR_PUBLIC_KEY'
      // );

      toast.success("Повідомлення успішно відправлено!");
      form.reset();
    } catch (error) {
      toast.error("Помилка відправлення повідомлення. Спробуйте ще раз.");
      console.error("Email send error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} container`}>
      <h1 className={styles.title}>Контакти</h1>

      <div className={styles.contactsGrid}>
        <div className={styles.contactCard}>
          <div className={styles.contactCardHeader}>
            <div className={styles.contactIcon}>
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h2 className={styles.contactCardTitle}>Телефони</h2>
          </div>
          <div className={styles.contactInfo}>
            <a href="tel:+380441234567" className={styles.contactLink}>
              +380 (44) 123-45-67
            </a>
            <a href="tel:+380671234567" className={styles.contactLink}>
              +380 (67) 123-45-67
            </a>
            <p className={styles.contactNote}>Безкоштовно по Україні</p>
          </div>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.contactCardHeader}>
            <div className={styles.contactIcon}>
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h2 className={styles.contactCardTitle}>Email</h2>
          </div>
          <div className={styles.contactInfo}>
            <a href="mailto:info@budlider.ua" className={styles.contactLink}>
              info@budlider.ua
            </a>
            <a href="mailto:sales@budlider.ua" className={styles.contactLink}>
              sales@budlider.ua
            </a>
            <p className={styles.contactNote}>Відповідаємо протягом 1 години</p>
          </div>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.contactCardHeader}>
            <div className={styles.contactIcon}>
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h2 className={styles.contactCardTitle}>Адреса</h2>
          </div>
          <div className={styles.contactInfo}>
            <p className={styles.contactText}>м. Київ, вул. Будівельна, 123</p>
            <p className={styles.contactNote}>Офіс та склад самовивозу</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              Показати на карті →
            </a>
          </div>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.contactCardHeader}>
            <div className={styles.contactIcon}>
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h2 className={styles.contactCardTitle}>Графік роботи</h2>
          </div>
          <div className={styles.contactInfo}>
            <p className={styles.contactText}>Пн-Пт: 8:00 - 18:00</p>
            <p className={styles.contactText}>Сб: 9:00 - 16:00</p>
            <p className={styles.contactText}>Нд: вихідний</p>
            <p className={styles.contactNote}>Прийом замовлень 24/7</p>
          </div>
        </div>
      </div>

      {/* Форма зворотного зв'язку */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Зворотний зв'язок</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Ім'я <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="Ваше ім'я"
                name="name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Телефон <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                required
                className={styles.input}
                placeholder="+380"
                name="phone"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              name="email"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Повідомлення <span className={styles.required}>*</span>
            </label>
            <textarea
              required
              rows={5}
              className={styles.textarea}
              placeholder="Ваше повідомлення..."
              name="message"
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Відправляється..." : "Відправити повідомлення"}
          </button>
        </form>
      </div>

      {/* Соцмережі */}
      <div className={styles.socialCard}>
        <h2 className={styles.socialTitle}>Ми в соціальних мережах</h2>
        <p className={styles.socialDescription}>
          Слідкуйте за новинами та акціями
        </p>
        <div className={styles.socialLinks}>
          <a href="#" className={styles.socialLink}>
            <span>f</span>
          </a>
          <a href="#" className={styles.socialLink}>
            <span>in</span>
          </a>
          <a href="#" className={styles.socialLink}>
            <span>@</span>
          </a>
        </div>
      </div>
    </div>
  );
}
