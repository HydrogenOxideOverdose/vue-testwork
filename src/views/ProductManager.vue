<template>
  <div class="product-manager">
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
        <button 
          @click="saveToLocalStorage" 
          :disabled="!hasChanges || isLoading"
          class="big-btn"
        >
          {{ isLoading ? 'Ожидание...' : 'Сохранить в LocalStorage' }}
        </button>
      </div>

      <div class="table-section">
        <div class="table-header">
          <h2>Список товаров ({{ sortedProducts.length }})</h2>
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