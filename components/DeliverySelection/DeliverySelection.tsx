'use client';

import { useState, useEffect } from 'react';
import { FormikProps } from 'formik';
import { cities, getWarehousesByCity, type Warehouse } from '@/data/deliveryData';
import { MapPin, Package, ChevronDown } from 'lucide-react';
import styles from './DeliverySelection.module.css';

interface DeliverySelectionProps {
  control: FormikProps<any>;
  errors: any;
  deliveryMethod: 'novaposhta' | 'ukrposhta';
  onAddressChange: (city: string, warehouse: string) => void;
}

export function DeliverySelection({ control, errors, deliveryMethod, onAddressChange }: DeliverySelectionProps) {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const filteredCities = citySearch
    ? cities.filter(city => 
        city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        city.area.toLowerCase().includes(citySearch.toLowerCase())
      )
    : cities;

  // Оновлення складів при зміні міста або способу доставки
  useEffect(() => {
    if (selectedCity) {
      const warehousesList = getWarehousesByCity(selectedCity, deliveryMethod);
      setWarehouses(warehousesList);
      setSelectedWarehouse('');
    } else {
      setWarehouses([]);
      setSelectedWarehouse('');
    }
  }, [selectedCity, deliveryMethod]);

  // Формування адреси тільки коли обрано і місто, і склад
  useEffect(() => {
    if (selectedCity && selectedWarehouse) {
      const city = cities.find(c => c.id === selectedCity);
      const warehouse = warehouses.find(w => w.id === selectedWarehouse);
      
      if (city && warehouse) {
        const deliveryName = deliveryMethod === 'novaposhta' ? 'Нова Пошта' : 'Укрпошта';
        const warehouseInfo = deliveryMethod === 'novaposhta' 
          ? `відділення №${warehouse.number}` 
          : `відділення ${warehouse.number}`;
        const fullAddress = `${deliveryName}, ${city.name}, ${warehouseInfo}, ${warehouse.address}`;
        onAddressChange(city.name, fullAddress);
      }
    }
    // Викликаємо тільки коли змінюються selectedCity, selectedWarehouse або deliveryMethod
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedWarehouse, deliveryMethod]);

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setCitySearch(city.name);
    }
    setShowCityDropdown(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Package className={styles.headerIcon} />
        <span>
          {deliveryMethod === 'novaposhta' ? 'Нова Пошта' : 'Укрпошта'} - Доставка у відділення
        </span>
      </div>

      {/* Вибір міста */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Місто <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWrapper}>
          <MapPin className={styles.inputIcon} />
          <input
            type="text"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setShowCityDropdown(true);
              if (!e.target.value) {
                setSelectedCity('');
              }
            }}
            onFocus={() => setShowCityDropdown(true)}
            placeholder="Введіть назву міста"
            className={styles.input}
          />
          <ChevronDown 
            className={`${styles.chevronIcon} ${showCityDropdown ? styles.open : ''}`}
          />
        </div>
        
        {showCityDropdown && filteredCities.length > 0 && (
          <div className={styles.dropdown}>
            {filteredCities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCitySelect(city.id)}
                className={`${styles.dropdownItem} ${selectedCity === city.id ? styles.selected : ''}`}
              >
                <div className={styles.cityName}>{city.name}</div>
                <div className={styles.cityArea}>{city.area}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Вибір відділення */}
      {selectedCity && warehouses.length > 0 && (
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Відділення <span className={styles.required}>*</span>
          </label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className={styles.select}
          >
            <option value="">Оберіть відділення</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {deliveryMethod === 'novaposhta' 
                  ? `Відділення №${warehouse.number}` 
                  : `Відділення ${warehouse.number}`} - {warehouse.address}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedCity && warehouses.length === 0 && (
        <div className={styles.noWarehouses}>
          У цьому місті немає доступних відділень
        </div>
      )}
    </div>
  );
}