import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Product, ProductCategory, ProductStatus, ProductFormData, Notification } from '@/types/product';
import { ProductsState } from '@/store/types';
import { mockApi } from '@/services/mockApi';
import { localStorageService } from '@/utils/localStorage';

@Module({ namespaced: true, name: 'products' })
export default class ProductsModule extends VuexModule implements ProductsState {
  products: Product[] = [];
  isLoading = false;
  hasChanges = false;
  notification: Notification | null = null;

  get sortedProducts(): Product[] {
    return [...this.products];
  }

  @Mutation
  SET_PRODUCTS(products: Product[]): void {
    this.products = products;
  }

  @Mutation
  SET_LOADING(loading: boolean): void {
    this.isLoading = loading;
  }

  @Mutation
  SET_HAS_CHANGES(hasChanges: boolean): void {
    this.hasChanges = hasChanges;
  }

  @Mutation
  SET_NOTIFICATION(notification: Notification | null): void {
    this.notification = notification;
  }

  @Mutation
  ADD_PRODUCT(product: Product): void {
    this.products.push(product);
    this.hasChanges = true;
  }

  @Mutation
  REMOVE_PRODUCT(productId: number): void {
    this.products = this.products.filter(p => p.id !== productId);
    this.hasChanges = true;
  }

  @Mutation
  MOVE_PRODUCT(payload: { fromIndex: number; toIndex: number }): void {
    const { fromIndex, toIndex } = payload;
    const product = this.products[fromIndex];
    this.products.splice(fromIndex, 1);
    this.products.splice(toIndex, 0, product);
    this.hasChanges = true;
  }

  @Action
  async loadProducts(): Promise<void> {
    const savedProducts = localStorageService.getProducts();
    this.SET_PRODUCTS(savedProducts);
  }

  @Action
  async addProduct({ commit, dispatch }: any, formData: ProductFormData): Promise<void> {
    console.log('Store addProduct получил:', formData);
    
    commit('SET_LOADING', true);
    try {
      await mockApi.createProduct(formData);
      
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name,
        category: formData.category as ProductCategory,
        price: formData.price || 0,
        quantity: formData.quantity || 0,
        status: (formData.quantity || 0) > 0 ? ProductStatus.IN_STOCK : ProductStatus.OUT_OF_STOCK
      };

      console.log('Новый продукт для добавления:', newProduct);
      
      commit('ADD_PRODUCT', newProduct);
      dispatch('showNotification', { message: 'Товар успешно добавлен', type: 'success' });
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      dispatch('showNotification', { message: 'Ошибка при добавлении товара', type: 'error' });
    } finally {
      commit('SET_LOADING', false);
    }
  }

  @Action
  async deleteProduct(productId: number): Promise<void> {
    this.SET_LOADING(true);
    try {
      await mockApi.deleteProduct(productId);
      this.REMOVE_PRODUCT(productId);
      this.showNotification('Товар успешно удален', 'success');
    } catch (error) {
      this.showNotification('Ошибка при удалении товара', 'error');
    } finally {
      this.SET_LOADING(false);
    }
  }

  @Action
  moveProductUp(productId: number): void {
    const index = this.products.findIndex(p => p.id === productId);
    if (index > 0) {
      this.MOVE_PRODUCT({ fromIndex: index, toIndex: index - 1 });
    }
  }

  @Action
  moveProductDown(productId: number): void {
    const index = this.products.findIndex(p => p.id === productId);
    if (index < this.products.length - 1) {
      this.MOVE_PRODUCT({ fromIndex: index, toIndex: index + 1 });
    }
  }

  @Action
  saveToLocalStorage(): void {
    localStorageService.saveProducts(this.products);
    this.SET_HAS_CHANGES(false);
    this.showNotification('Данные успешно сохранены', 'success');
  }

  @Action
  showNotification(message: string, type: 'success' | 'error'): void {
    const notification: Notification = {
      type,
      message,
      id: Date.now()
    };
    this.SET_NOTIFICATION(notification);
    
    setTimeout(() => {
      this.SET_NOTIFICATION(null);
    }, 3000);
  }
}
