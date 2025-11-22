<template>
  <table class="product-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Название</th>
        <th>Категория</th>
        <th>Цена</th>
        <th>Количество</th>
        <th>Статус</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="product.id">
        <td>{{ product.id }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.category }}</td>
        <td>${{ product.price }}</td>
        <td>{{ product.quantity }}</td>
        <td>
          <span :class="['status', product.status === 'В наличии' ? 'in-stock' : 'out-of-stock']">
            {{ product.status }}
          </span>
        </td>
        <td class="actions">
          <button 
            @click="moveUp(product.id)" 
            :disabled="index === 0 || isLoading"
            class="btn-move"
            title="Переместить вверх"
          >
            ↑
          </button>
          <button 
            @click="moveDown(product.id)" 
            :disabled="index === products.length - 1 || isLoading"
            class="btn-move"
            title="Переместить вниз"
          >
            ↓
          </button>
          <button 
            @click="deleteProduct(product.id)" 
            :disabled="isLoading"
            class="btn-delete"
            title="Удалить товар"
          >
            Удалить
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Product } from '@/types/product';

@Component
export default class ProductTable extends Vue {
  @Prop({ type: Array, required: true }) products!: Product[];
  @Prop({ type: Boolean, default: false }) isLoading!: boolean;

  @Emit('move-up')
  moveUp(productId: number): number {
    return productId;
  }

  @Emit('move-down')
  moveDown(productId: number): number {
    return productId;
  }

  @Emit('delete')
  deleteProduct(productId: number): number {
    return productId;
  }
}
</script>

<style scoped>
.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.product-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.status.in-stock {
  color: #4CAF50;
  font-weight: bold;
}

.status.out-of-stock {
  color: #f44336;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 5px;
}

.btn-move {
  background: #ff9800;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-move:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>