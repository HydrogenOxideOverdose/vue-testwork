export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  status: ProductStatus;
}

export enum ProductCategory {
  ELECTRONICS = 'Электроника',
  CLOTHING = 'Одежда',
  FOOD = 'Еда'
}

export enum ProductStatus {
  IN_STOCK = 'В наличии',
  OUT_OF_STOCK = 'Нет в наличии'
}

export interface ProductFormData {
  name: string;
  category: ProductCategory | '';
  price: number | null;
  quantity: number | null;
}

export interface ValidationErrors {
  name?: string;
  category?: string;
  price?: string;
  quantity?: string;
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
  id: number;
}

export interface MoveProductPayload {
  fromIndex: number;
  toIndex: number;
}