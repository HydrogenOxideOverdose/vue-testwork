{{

/*

Надо переписать loadProducts, handleAddProduct, moveProductUp, moveProductDown, saveToLocalStorage, showNotification
У них уже есть свои Actions в модели, которые надо сюда подключить

*/

}}







<template>
  <div class="product-manager">
    <h1>Управление товарами</h1>

    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>

    <div class="manager-container">

      <div class="form-section">
        <h2>Добавить товар</h2>
        <ProductForm 
          :isLoading="isLoading"
          @submit="handleAddProduct"
        />
      </div>

      <div class="table-section">
        <div class="table-header">
          <h2>Список товаров ({{ products.length }})</h2>
          <button 
            @click="saveToLocalStorage" 
            :disabled="!hasChanges || isLoading"
            class="btn-save"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить в LocalStorage' }}
          </button>
        </div>

        <div v-if="isLoading && products.length === 0" class="loading">
          <div class="spinner"></div>
          <p>Загрузка...</p>
        </div>

        <ProductTable
          v-else
          :products="products"
          :isLoading="isLoading"
          @move-up="moveProductUp"
          @move-down="moveProductDown"
          @delete="handleDeleteProduct"
        />

        <p v-if="products.length === 0 && !isLoading" class="no-products">
          Нет товаров для отображения
        </p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Product, ProductFormData, ProductCategory, ProductStatus, Notification } from '@/types/product';
import ProductForm from '@/components/ProductForm.vue';
import ProductTable from '@/components/ProductTable.vue';
import { mockApi } from "@/services/mockApi";  // Mock API


// LocalStorage service
const localStorageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem('products-data');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem('products-data', JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }
};

@Component({
  components: {
    ProductForm,
    ProductTable
  }
})
export default class ProductManager extends Vue {
  products: Product[] = [];
  isLoading = false;
  hasChanges = false;
  notification: Notification | null = null;

  mounted(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    const savedProducts = localStorageService.getProducts();
    this.products = savedProducts;
  }

  async handleAddProduct(formData: ProductFormData): Promise<void> {
    console.log('Данные из формы:', formData);
    
    this.isLoading = true;
    try {
      await mockApi.createProduct( formData );
      
      const newProduct: Product = {



        id: Date.now(),

        /*

              /\
              ||
              ||
              ||

        */

        //В тз не указанно как id выбирать
        //Возможно имеет смысл хранить последний хранить в localstorage или находить крайний и делать +1

        //TODO: сдалать ченибудь из этого
        
        name: formData.name,
        category: formData.category as ProductCategory,
        price: Number(formData.price) || 0,
        quantity: Math.max(0, Math.round(Number(formData.quantity))) || 0,
        status: (Number(formData.quantity) || 0) > 0 ? ProductStatus.IN_STOCK : ProductStatus.OUT_OF_STOCK
      };

      console.log('newProduct', newProduct);
      
      this.products.push(newProduct);

      this.hasChanges = true;
      this.showNotification('Товар успешно добавлен', 'success');
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      this.showNotification('Ошибка при добавлении товара', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  async handleDeleteProduct(productId: number): Promise<void> {

    // TODO: Надо бы кастомный confirm сделать

    //if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      this.isLoading = true;
      try {
        await mockApi.deleteProduct( productId );

        this.products = this.products.filter(p => p.id !== productId);

        this.hasChanges = true;
        this.showNotification('Товар успешно удален', 'success');
      } catch (error) {
        console.error('Ошибка при удалении товара:', error);
        this.showNotification('Ошибка при удалении товара', 'error');
      } finally {
        this.isLoading = false;
      }
    //}
  }

  moveProductUp(productId: number): void {
    const index = this.products.findIndex(p => p.id === productId);
    if (index > 0) {
      const product = this.products[index];
      this.products.splice(index, 1);
      this.products.splice(index - 1, 0, product);
      this.hasChanges = true;
    }
  }

  moveProductDown(productId: number): void {
    const index = this.products.findIndex(p => p.id === productId);
    if (index < this.products.length - 1) {
      const product = this.products[index];
      this.products.splice(index, 1);
      this.products.splice(index + 1, 0, product);
      this.hasChanges = true;
    }
  }

  saveToLocalStorage(): void {
    localStorageService.saveProducts(this.products);
    this.hasChanges = false;
    this.showNotification('Данные успешно сохранены', 'success');
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = {
      type,
      message,
      id: Date.now()
    };
    
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
}
</script>

<style scoped>
.product-manager {
  max-width: 1200px;
  margin: 0 auto;
}

.manager-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-top: 20px;
}

.form-section, .table-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-save {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-save:not(:disabled):hover {
  background: #45a049;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  z-index: 1000;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #f44336;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-products {
  text-align: center;
  color: #666;
  padding: 40px;
}
</style>