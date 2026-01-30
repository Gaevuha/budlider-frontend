import { Check, Clock, XCircle, Package } from 'lucide-react';
import styles from './AvailabilityBadge.module.css';

interface AvailabilityBadgeProps {
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  stock?: number;
  size?: 'small' | 'medium' | 'large';
  showStock?: boolean;
}

export function AvailabilityBadge({ 
  availability, 
  stock, 
  size = 'medium',
  showStock = true 
}: AvailabilityBadgeProps) {
  const getConfig = () => {
    switch (availability) {
      case 'in_stock':
        return {
          icon: Check,
          text: 'В наявності',
          className: styles.inStock,
          iconClassName: styles.iconInStock
        };
      case 'pre_order':
        return {
          icon: Clock,
          text: 'Під замовлення',
          className: styles.preOrder,
          iconClassName: styles.iconPreOrder
        };
      case 'out_of_stock':
        return {
          icon: XCircle,
          text: 'Товар відсутній',
          className: styles.outOfStock,
          iconClassName: styles.iconOutOfStock
        };
      default:
        return {
          icon: Package,
          text: 'Статус невідомий',
          className: styles.unknown,
          iconClassName: styles.iconUnknown
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;
  
  const sizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

  return (
    <div className={`${styles.badge} ${config.className} ${sizeClass}`}>
      <Icon className={`${styles.icon} ${config.iconClassName}`} />
      <span className={styles.text}>
        {config.text}
        {availability === 'in_stock' && showStock && stock && stock > 0 && (
          <span className={styles.stockCount}> ({stock} шт)</span>
        )}
      </span>
    </div>
  );
}
