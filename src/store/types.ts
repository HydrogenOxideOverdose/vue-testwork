import { Product, Notification } from '@/types/product';

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  hasChanges: boolean;
  notification: Notification | null;
}