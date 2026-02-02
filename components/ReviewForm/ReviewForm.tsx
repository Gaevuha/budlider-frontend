"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/authModalStore";
import { useReviewsStore } from "@/store/reviewsStore";
import { createReviewClient } from "@/lib/api/apiClient";
import { toast } from "@/lib/utils/toast";
import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess?: () => void;
}

export function ReviewForm({ productId, onSubmitSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const { openModal: openAuthModal } = useAuthModalStore();
  const { addReview } = useReviewsStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Для неавторизованих користувачів перевіряємо ім'я
    if (!user && guestName.trim().length < 2) {
      toast.error("Будь ласка, введіть ваше ім'я (мінімум 2 символи)");
      return;
    }

    if (rating === 0) {
      toast.error("Будь ласка, оберіть рейтинг");
      return;
    }

    if (text.trim().length < 10) {
      toast.error("Відгук має містити хоча б 10 символів");
      return;
    }

    setIsSubmitting(true);

    try {
      // Спроба відправити на бекенд
      try {
        const response = await createReviewClient(productId, {
          rating,
          text: text.trim(),
          guestName: !user ? guestName.trim() : undefined,
        });

        // Додаємо відгук в локальний store з даними від бекенду
        addReview({
          productId,
          userId: response.user?._id || "guest-" + Date.now(),
          userName: response.user?.name || guestName.trim(),
          userAvatar: response.user?.avatar,
          rating: response.rating,
          text: response.text,
        });
      } catch (apiError) {
        console.warn("API недоступний, зберігаємо локально:", apiError);

        // Якщо API недоступний, зберігаємо локально
        addReview({
          productId,
          userId: user?._id || "guest-" + Date.now(),
          userName: user?.name || guestName.trim(),
          userAvatar: user?.avatar,
          rating,
          text: text.trim(),
        });
      }

      toast.success("Дякуємо за ваш відгук!");
      setRating(0);
      setText("");
      setGuestName("");
      onSubmitSuccess?.();
    } catch (error) {
      toast.error("Помилка при додаванні відгуку");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>Залишити відгук</h3>

      {!user && (
        <div className={styles.guestNameSection}>
          <label htmlFor="guestName" className={styles.label}>
            Ваше ім'я *
          </label>
          <input
            id="guestName"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Введіть ваше ім'я"
            className={styles.input}
            minLength={2}
            maxLength={50}
            required
          />
        </div>
      )}

      <div className={styles.ratingSection}>
        <label className={styles.label}>Ваша оцінка *</label>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className={styles.starButton}
            >
              <Star
                className={`${styles.star} ${
                  star <= (hoveredRating || rating) ? styles.starFilled : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.commentSection}>
        <label htmlFor="comment" className={styles.label}>
          Ваш відгук *
        </label>
        <textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Поділіться своїми враженнями про товар..."
          className={styles.textarea}
          rows={5}
          minLength={10}
          required
        />
        <span className={styles.charCount}>{text.length} символів</span>
      </div>

      <button
        type="submit"
        disabled={
          isSubmitting ||
          rating === 0 ||
          text.trim().length < 10 ||
          (!user && guestName.trim().length < 2)
        }
        className={styles.submitButton}
      >
        {isSubmitting ? "Надсилання..." : "Опублікувати відгук"}
      </button>

      {!user && (
        <p className={styles.guestNote}>
          Маєте акаунт?{" "}
          <button
            type="button"
            onClick={openAuthModal}
            className={styles.loginLink}
          >
            Увійдіть
          </button>{" "}
          для швидшого залишення відгуків
        </p>
      )}
    </form>
  );
}
