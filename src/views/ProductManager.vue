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
          <h2>Список товаров ({{ sortedProducts.length }})</h2>
          <button 
            @click="saveToLocalStorage" 
            :disabled="!hasChanges || isLoading"
            class="btn-save"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить в LocalStorage' }}
          </button>
        </div>

        <div v-if="isLoading && sortedProducts.length === 0" class="loading">
          <div class="spinner"></div>
          <p>Загрузка...</p>
        </div>

        <ProductTable
          v-else
          :products="sortedProducts"
          :isLoading="isLoading"
          @move-up="moveProductUp"
          @move-down="moveProductDown"
          @delete="handleDeleteProduct"
        />

        <p v-if="sortedProducts.length === 0 && !isLoading" class="no-products">
          Нет товаров для отображения
        </p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';
import { ProductFormData } from '@/types/product';
import ProductForm from '@/components/ProductForm.vue';
import ProductTable from '@/components/ProductTable.vue';


import { localStorageService } from '@/utils/localStorage';


@Component({
  components: {
    ProductForm,
    ProductTable
  },
  computed: {
    ...mapGetters('products', ['sortedProducts']),
    ...mapState('products', ['isLoading', 'hasChanges', 'notification'])
  }
})
export default class ProductManager extends Vue {

  async mounted(): Promise<void> {
    await this.$store.dispatch('products/loadProducts');
    console.log( this.$store.getters['products/sortedProducts'], "sortedProducts" )
  }

  async handleAddProduct(formData: ProductFormData): Promise<void> {
    console.log('Данные из формы:', formData);
    await this.$store.dispatch('products/addProduct', formData);
  }

  async handleDeleteProduct(productId: number): Promise<void> {
    await this.$store.dispatch('products/deleteProduct', productId);
  }

  async moveProductUp(productId: number): Promise<void> {
    this.$store.dispatch('products/moveProductUp', productId);
  }

  async moveProductDown(productId: number): Promise<void> {
    this.$store.dispatch('products/moveProductDown', productId);
  }

  async saveToLocalStorage(): Promise<void> {
    this.$store.dispatch('products/saveToLocalStorage');
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