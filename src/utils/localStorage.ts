import { Product, ProductCategory, ProductStatus } from '@/types/product';

const STORAGE_KEY = 'products-data';

export const localStorageService = {
  getProducts(): Product[] {

    const newProduct: Product = {
      id: 1,
      name: 'Начальные данные',
      category: ProductCategory.ELECTRONICS,
      price: 100,
      quantity: 1,
      status: ProductStatus.IN_STOCK
    };

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data).length > 0 ? JSON.parse(data) : [ newProduct ] :  [ newProduct ];
    } catch {
      return [
        newProduct
      ];
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }
}