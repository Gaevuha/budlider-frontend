'use client';

import { FormikProps } from 'formik';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import styles from './CardPaymentForm.module.css';

interface CardPaymentFormProps {
  control: FormikProps<any>;
  errors: any;
}

export function CardPaymentForm({ control, errors }: CardPaymentFormProps) {
  // Форматування номера картки (додавання пробілів)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Форматування дати (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        <CreditCard className={styles.titleIcon} />
        Дані банківської картки
      </h3>

      {/* Номер картки */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Номер картки <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="cardNumber"
            value={control.values.cardNumber || ''}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              control.setFieldValue('cardNumber', formatted);
            }}
            onBlur={control.handleBlur}
            maxLength={19}
            className={`${styles.input} ${styles.inputWithIcon} ${
              control.touched.cardNumber && errors.cardNumber ? styles.error : ''
            }`}
            placeholder="1234 5678 9012 3456"
          />
          <CreditCard className={styles.inputIcon} />
        </div>
        {control.touched.cardNumber && errors.cardNumber && (
          <p className={styles.errorMessage}>{errors.cardNumber}</p>
        )}
      </div>

      {/* Ім'я власника картки */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Ім'я власника (як на картці) <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="cardHolder"
          value={control.values.cardHolder || ''}
          onChange={control.handleChange}
          onBlur={control.handleBlur}
          className={`${styles.input} ${styles.cardHolderInput} ${
            control.touched.cardHolder && errors.cardHolder ? styles.error : ''
          }`}
          placeholder="TARAS SHEVCHENKO"
        />
        {control.touched.cardHolder && errors.cardHolder && (
          <p className={styles.errorMessage}>{errors.cardHolder}</p>
        )}
      </div>

      <div className={styles.gridRow}>
        {/* Термін дії */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Термін дії <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="expiryDate"
              value={control.values.expiryDate || ''}
              onChange={(e) => {
                const formatted = formatExpiryDate(e.target.value);
                control.setFieldValue('expiryDate', formatted);
              }}
              onBlur={control.handleBlur}
              maxLength={5}
              className={`${styles.input} ${styles.inputWithIcon} ${
                control.touched.expiryDate && errors.expiryDate ? styles.error : ''
              }`}
              placeholder="MM/YY"
            />
            <Calendar className={styles.inputIcon} />
          </div>
          {control.touched.expiryDate && errors.expiryDate && (
            <p className={styles.errorMessage}>{errors.expiryDate}</p>
          )}
        </div>

        {/* CVV */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            CVV <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="cvv"
              value={control.values.cvv || ''}
              onChange={control.handleChange}
              onBlur={control.handleBlur}
              maxLength={3}
              className={`${styles.input} ${styles.inputWithIcon} ${
                control.touched.cvv && errors.cvv ? styles.error : ''
              }`}
              placeholder="123"
            />
            <Lock className={styles.inputIcon} />
          </div>
          {control.touched.cvv && errors.cvv && (
            <p className={styles.errorMessage}>{errors.cvv}</p>
          )}
        </div>
      </div>

      <div className={styles.securityNotice}>
        <Lock className={styles.securityIcon} />
        <p className={styles.securityText}>
          Ваші дані захищені за допомогою 256-бітного SSL-шифрування. 
          Ми не зберігаємо дані вашої картки на наших серверах.
        </p>
      </div>
    </div>
  );
}