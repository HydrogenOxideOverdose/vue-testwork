import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators';
import { Product, ProductCategory, ProductStatus, ProductFormData, Notification } from '@/types/product';
import { ProductsState } from '@/store/types';
import { mockApi } from '@/services/mockApi';
import { localStorageService } from '@/utils/localStorage';

@Module({
  namespaced: true,
  name: 'products'
})
export default class ProductsModule extends VuexModule implements ProductsState {
  products: Product[] = [];
  isLoading = false;
  hasChanges = false;
  notification: Notification | null = null;

  get sortedProducts(): Product[] {
    return [...this.products];
  }

  @Mutation
  SET_NOTIFICATION(notification: Notification | null): void {
    this.notification = notification;
  }

  @MutationAction
  async loadProducts() {
    console.log('MutationAction: loadProducts');
    const savedProducts = localStorageService.getProducts();
    console.log('Loaded from localStorage:', savedProducts);
    return { products: savedProducts };
  }

  @MutationAction
  async addProduct(formData: ProductFormData) {
    console.log('MutationAction: addProduct получил:', formData);
    try {
      this.context.commit('SET_LOADING', true);
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
      const updatedProducts = [...this.products, newProduct];
      showNotificationHelper(this, 'Товар успешно добавлен', 'success' );
      return { 
        products: updatedProducts,
        hasChanges: true
      };
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      showNotificationHelper(this, 'Ошибка при добавлении товара', 'error');
      return { 
        products: this.products 
      };
    } finally {
      this.context.commit('SET_LOADING', false);
    }
  }

  @MutationAction
  async deleteProduct(productId: number) {
    console.log('MutationAction: deleteProduct', productId);
    try {
      this.context.commit('SET_LOADING', true);
      await mockApi.deleteProduct(productId);
      const updatedProducts = this.products.filter(p => p.id !== productId);
      showNotificationHelper(this, 'Товар успешно удален', 'success' );

      return { 
        products: updatedProducts,
        hasChanges: true
      };
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      showNotificationHelper(this, 'Ошибка при удалении товара', 'error' );
      return { 
        products: this.products 
      };
    } finally {
      this.context.commit('SET_LOADING', false);
    }
  }

  @MutationAction
  async moveProductUp(productId: number) {
    console.log('MutationAction: moveProductUp', productId);
    const index = this.products.findIndex(p => p.id === productId);
    if (index > 0) {
      const products = [...this.products];
      const product = products[index];
      products.splice(index, 1);
      products.splice(index - 1, 0, product);
      
      return { 
        products,
        hasChanges: true
      };
    }
    return { 
      products: this.products 
    };
  }

  @MutationAction
  async moveProductDown(productId: number) {
    console.log('MutationAction: moveProductDown', productId);
    const index = this.products.findIndex(p => p.id === productId);
    if (index < this.products.length - 1) {
      const products = [...this.products];
      const product = products[index];
      products.splice(index, 1);
      products.splice(index + 1, 0, product);
      
      return { 
        products,
        hasChanges: true
      };
    }
    return { 
      products: this.products 
    };
  }

  @MutationAction
  async saveToLocalStorage() {
    console.log('MutationAction: saveToLocalStorage');
    
    localStorageService.saveProducts(this.products);
    
    showNotificationHelper(this, 'Данные успешно сохранены', 'success');

    return { 
      hasChanges: false 
    };
  }

}


interface NotificationContext {
  context: {
    commit: (mutation: string, payload?: any) => void;
  };
}

const showNotificationHelper = (ctx: NotificationContext, message: string, type: 'success' | 'error'): void => {
  const notification: Notification = {
    type,
    message,
    id: Date.now()
  };
  
  console.log("message", message, type);
  ctx.context.commit('SET_NOTIFICATION', notification);
  
  setTimeout(() => {
    ctx.context.commit('SET_NOTIFICATION', null);
  }, 3000);
};