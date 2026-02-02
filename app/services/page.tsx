"use client";

import { Construction, Truck, Package, Settings } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { createOrderClient } from "@/lib/api/apiClient";
import { toast } from "@/lib/utils/toast";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./ServicesPage.module.css";

interface Service {
  id: string;
  icon: any;
  name: string;
  description: string;
  pricePerHour: number;
  features: string[];
}

const services: Service[] = [
  {
    id: "crane",
    icon: Construction,
    name: "Послуги крана",
    description:
      "Автокран для підйому та переміщення важких вантажів на будівельних об'єктах.",
    pricePerHour: 1200,
    features: [
      "Вантажопідйомність до 25 тонн",
      "Висота підйому до 30 метрів",
      "Досвідчені крановики",
      "Робота в будь-яких умовах",
    ],
  },
  {
    id: "manitou",
    icon: Settings,
    name: "Послуги Маніту (телескопічний навантажувач)",
    description:
      "Телескопічний навантажувач для робіт на висоті та переміщення матеріалів.",
    pricePerHour: 950,
    features: [
      "Вантажопідйомність до 4 тонн",
      "Висота підйому до 18 метрів",
      "Маневреність на об'єкті",
      "Швидке переміщення матеріалів",
    ],
  },
  {
    id: "excavator",
    icon: Construction,
    name: "Послуги екскаватора",
    description:
      "Земельні роботи, копання котлованів, траншей та інші екскаваторні роботи.",
    pricePerHour: 850,
    features: [
      "Об'єм ковша 0.6-1.2 м³",
      "Глибина копання до 5 метрів",
      "Високопродуктивна техніка",
      "Професійні оператори",
    ],
  },
  {
    id: "truck",
    icon: Truck,
    name: "Послуги вантажівки",
    description:
      "Транспортування будівельних матеріалів та обладнання по місту та області.",
    pricePerHour: 650,
    features: [
      "Вантажопідйомність до 10 тонн",
      "Об'єм кузова до 40 м³",
      "Доставка по всій Україні",
      "Можливість вивантаження",
    ],
  },
];

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Початкові значення форми - якщо користувач авторизований, заповнюємо його дані
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
  });

  // Оновлюємо початкові дані при відкритті модалки
  useEffect(() => {
    if (isModalOpen && user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: "",
        comment: "",
      });
    } else if (isModalOpen) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        comment: "",
      });
    }
  }, [isModalOpen, user]);

  const handleServiceRequest = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const serviceOrder: any = {
        items: [],
        total: 0,
        customerName: formData.get("name") as string,
        customerPhone: formData.get("phone") as string,
        customerEmail: formData.get("email") as string,
        deliveryAddress: formData.get("address") as string,
        deliveryMethod: "self-pickup",
        comment: formData.get("comment") as string,
        paymentMethod: "cash",
        type: "service",
        serviceName: selectedService?.name || "",
      };

      await createOrderClient(serviceOrder);

      toast.success(
        "Заявку успішно відправлено! Наш менеджер зв'яжеться з вами найближчим часом."
      );

      // Скидаємо форму
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        comment: "",
      });

      setIsModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error("Помилка відправлення заявки. Спробуйте ще раз.");
      console.error("Service request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Послуги спецтехніки</h1>
        <p className={styles.subtitle}>
          «Будлідер» надає послуги спецтехніки для будівельних та земельних
          робіт
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceHeader}>
                <div className={styles.serviceIcon}>
                  <Icon className={styles.serviceIconSvg} />
                </div>
                <div className={styles.servicePrice}>
                  <div className={styles.servicePriceValue}>
                    {service.pricePerHour} грн
                  </div>
                  <div className={styles.servicePriceLabel}>за годину</div>
                </div>
              </div>

              <h3 className={styles.serviceName}>{service.name}</h3>

              <p className={styles.serviceDescription}>{service.description}</p>

              <ul className={styles.serviceFeatures}>
                {service.features.map((feature, index) => (
                  <li key={index} className={styles.serviceFeature}>
                    <span className={styles.serviceFeatureIcon}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleServiceRequest(service)}
                className={styles.serviceButton}
              >
                Замовити послугу
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.consultationSection}>
        <div className={styles.consultationContent}>
          <h2 className={styles.consultationTitle}>Потрібна консультація?</h2>
          <p className={styles.consultationDescription}>
            Наші фахівці готові відповісти на всі ваші питання та допомогти з
            вибором послуг
          </p>
          <div className={styles.consultationActions}>
            <a href="tel:+380441234567" className={styles.consultationButton}>
              Зателефонувати
            </a>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>500+</div>
          <div className={styles.statLabel}>Виконаних проєктів</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>10+</div>
          <div className={styles.statLabel}>Років на ринку</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>98%</div>
          <div className={styles.statLabel}>Задоволених клієнтів</div>
        </div>
      </div>

      {/* Modal форма заявки */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTop}>
                <h2 className={styles.modalTitle}>Заявка на послугу</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedService(null);
                  }}
                  className={styles.modalCloseButton}
                >
                  ✕
                </button>
              </div>
              {selectedService && (
                <p className={styles.modalSubtitle}>
                  {selectedService.name} • {selectedService.pricePerHour}{" "}
                  грн/год
                </p>
              )}
              {!user && (
                <div className={styles.modalInfoBox}>
                  <p className={styles.modalInfoText}>
                    💡 Реєстрація не потрібна! Просто заповніть форму і ми
                    зв'яжемося з вами.
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Ім'я <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={styles.input}
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Телефон <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className={styles.input}
                  placeholder="+380"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Адреса об'єкту <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className={styles.input}
                  placeholder="Місто, вулиця, будинок"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Коментар (опишіть деталі роботи)
                </label>
                <textarea
                  name="comment"
                  rows={4}
                  className={styles.textarea}
                  placeholder="Опишіть що потрібно зробити, кількість годин..."
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedService(null);
                  }}
                  className={styles.cancelButton}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "Відправлення..." : "Відправити заявку"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
