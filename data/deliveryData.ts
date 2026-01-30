export interface City {
  id: string;
  name: string;
  area: string;
}

export interface Warehouse {
  id: string;
  cityId: string;
  number: string;
  address: string;
}

// Мок-дані міст
export const cities: City[] = [
  { id: '1', name: 'Київ', area: 'Київська область' },
  { id: '2', name: 'Львів', area: 'Львівська область' },
  { id: '3', name: 'Одеса', area: 'Одеська область' },
  { id: '4', name: 'Дніпро', area: 'Дніпропетровська область' },
  { id: '5', name: 'Харків', area: 'Харківська область' },
  { id: '6', name: 'Запоріжжя', area: 'Запорізька область' },
  { id: '7', name: 'Вінниця', area: 'Вінницька область' },
  { id: '8', name: 'Полтава', area: 'Полтавська область' },
  { id: '9', name: 'Черкаси', area: 'Черкаська область' },
  { id: '10', name: 'Чернігів', area: 'Чернігівська область' },
  { id: '11', name: 'Мена', area: 'Чернігівська область' },
];

// Мок-дані відділень Нової Пошти
export const novaPoshtaWarehouses: Warehouse[] = [
  // Київ
  { id: 'np1', cityId: '1', number: '1', address: 'вул. Хрещатик, 1' },
  { id: 'np2', cityId: '1', number: '5', address: 'вул. Саксаганського, 25' },
  { id: 'np3', cityId: '1', number: '12', address: 'просп. Перемоги, 45' },
  { id: 'np4', cityId: '1', number: '20', address: 'вул. Велика Васильківська, 72' },
  { id: 'np5', cityId: '1', number: '33', address: 'просп. Степана Бандери, 15' },
  
  // Львів
  { id: 'np6', cityId: '2', number: '1', address: 'вул. Городоцька, 123' },
  { id: 'np7', cityId: '2', number: '7', address: 'вул. Личаківська, 45' },
  { id: 'np8', cityId: '2', number: '15', address: 'просп. Свободи, 28' },
  
  // Одеса
  { id: 'np9', cityId: '3', number: '2', address: 'вул. Дерибасівська, 10' },
  { id: 'np10', cityId: '3', number: '8', address: 'Французький бульвар, 55' },
  { id: 'np11', cityId: '3', number: '14', address: 'вул. Преображенська, 30' },
  
  // Дніпро
  { id: 'np12', cityId: '4', number: '3', address: 'просп. Яворницького, 67' },
  { id: 'np13', cityId: '4', number: '11', address: 'вул. Робоча, 15' },
  { id: 'np14', cityId: '4', number: '25', address: 'просп. Пушкіна, 42' },
  
  // Харків
  { id: 'np15', cityId: '5', number: '4', address: 'вул. Сумська, 85' },
  { id: 'np16', cityId: '5', number: '9', address: 'просп. Науки, 12' },
  { id: 'np17', cityId: '5', number: '18', address: 'вул. Полтавський Шлях, 50' },
  
  // Запоріжжя
  { id: 'np18', cityId: '6', number: '6', address: 'просп. Соборний, 125' },
  { id: 'np19', cityId: '6', number: '13', address: 'вул. Перемоги, 78' },
  
  // Вінниця
  { id: 'np20', cityId: '7', number: '2', address: 'вул. Соборна, 45' },
  { id: 'np21', cityId: '7', number: '10', address: 'Хмельницьке шосе, 22' },
  
  // Полтава
  { id: 'np22', cityId: '8', number: '5', address: 'вул. Європейська, 30' },
  { id: 'np23', cityId: '8', number: '12', address: 'вул. Шевченка, 16' },
  
  // Черкаси
  { id: 'np24', cityId: '9', number: '3', address: 'бульвар Шевченка, 205' },
  { id: 'np25', cityId: '9', number: '8', address: 'вул. Смілянська, 89' },
  
  // Чернігів
  { id: 'np26', cityId: '10', number: '1', address: 'просп. Миру, 55' },
  { id: 'np27', cityId: '10', number: '7', address: 'вул. Пятницька, 12' },
  
  // Мена
  { id: 'np28', cityId: '11', number: '1', address: 'вул. Червоних Партизан, 54' },
  { id: 'np29', cityId: '11', number: '2', address: 'вул. Кірова, 28' },
  { id: 'np30', cityId: '11', number: '3', address: 'вул. Радянська, 15' },
];

// Мок-дані відділень Укрпошти
export const ukrPoshtaWarehouses: Warehouse[] = [
  // Київ
  { id: 'up1', cityId: '1', number: '01001', address: 'вул. Хрещатик, 22' },
  { id: 'up2', cityId: '1', number: '01010', address: 'вул. Михайлівська, 8' },
  { id: 'up3', cityId: '1', number: '01033', address: 'вул. Жилянська, 107' },
  { id: 'up4', cityId: '1', number: '01042', address: 'просп. Перемоги, 100' },
  
  // Львів
  { id: 'up5', cityId: '2', number: '79000', address: 'просп. Свободи, 38' },
  { id: 'up6', cityId: '2', number: '79010', address: 'вул. Дорошенка, 55' },
  { id: 'up7', cityId: '2', number: '79020', address: 'вул. Стрийська, 202' },
  
  // Одеса
  { id: 'up8', cityId: '3', number: '65000', address: 'вул. Садова, 3' },
  { id: 'up9', cityId: '3', number: '65014', address: 'вул. Канатна, 83' },
  { id: 'up10', cityId: '3', number: '65029', address: 'Малиновського, 16' },
  
  // Дніпро
  { id: 'up11', cityId: '4', number: '49000', address: 'вул. Короленка, 2' },
  { id: 'up12', cityId: '4', number: '49010', address: 'вул. Набережна Перемоги, 50' },
  
  // Харків
  { id: 'up13', cityId: '5', number: '61000', address: 'майдан Конституції, 8' },
  { id: 'up14', cityId: '5', number: '61001', address: 'вул. Сумська, 64' },
  { id: 'up15', cityId: '5', number: '61145', address: 'просп. Гагаріна, 177' },
  
  // Запоріжжя
  { id: 'up16', cityId: '6', number: '69000', address: 'вул. Перемоги, 48' },
  { id: 'up17', cityId: '6', number: '69063', address: 'просп. Соборний, 158' },
  
  // Вінниця
  { id: 'up18', cityId: '7', number: '21000', address: 'вул. Соборна, 62' },
  { id: 'up19', cityId: '7', number: '21018', address: 'Хмельницьке шосе, 8' },
  
  // Полтава
  { id: 'up20', cityId: '8', number: '36000', address: 'вул. Жовтнева, 40' },
  { id: 'up21', cityId: '8', number: '36014', address: 'вул. Котляревського, 2' },
  
  // Черкаси
  { id: 'up22', cityId: '9', number: '18000', address: 'вул. Хрещатик, 235' },
  { id: 'up23', cityId: '9', number: '18028', address: 'бульвар Шевченка, 333' },
  
  // Чернігів
  { id: 'up24', cityId: '10', number: '14000', address: 'вул. Шевченка, 55' },
  { id: 'up25', cityId: '10', number: '14013', address: 'просп. Миру, 42' },
  
  // Мена
  { id: 'up26', cityId: '11', number: '15600', address: 'вул. Червоних Партизан, 32' },
  { id: 'up27', cityId: '11', number: '15601', address: 'вул. Кірова, 18' },
];

export const getWarehousesByCity = (cityId: string, deliveryMethod: 'novaposhta' | 'ukrposhta'): Warehouse[] => {
  const warehouses = deliveryMethod === 'novaposhta' ? novaPoshtaWarehouses : ukrPoshtaWarehouses;
  return warehouses.filter(w => w.cityId === cityId);
};