<template>
  <form @submit.prevent="submitForm" class="product-form">
    <div class="form-group">
      <label for="name">Название:</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        @blur="validateAndShowField('name')"
        :class="{ error: fieldErrors.name }"
      />
      <span v-if="fieldErrors.name" class="error-message">{{ fieldErrors.name }}</span>
    </div>

    <div class="form-group">
      <label for="category">Категория:</label>
      <select
        id="category"
        v-model="formData.category"
        @blur="validateAndShowField('category')"
        :class="{ error: fieldErrors.category }"
      >
        <option value="">Выберите категорию</option>
        <option value="Электроника">Электроника</option>
        <option value="Одежда">Одежда</option>
        <option value="Еда">Еда</option>
      </select>
      <span v-if="fieldErrors.category" class="error-message">{{ fieldErrors.category }}</span>
    </div>

    <div class="form-group">
      <label for="price">Цена:</label>
      <input
        id="price"
        v-model.number="formData.price"
        type="number"
        min="0"
        step="0.01"
        @blur="validateAndShowField('price')"
        :class="{ error: fieldErrors.price }"
      />
      <span v-if="fieldErrors.price" class="error-message">{{ fieldErrors.price }}</span>
    </div>

    <div class="form-group">
      <label for="quantity">Количество:</label>
      <input
        id="quantity"
        v-model.number="formData.quantity"
        type="number"
        min="0"
        step="1"
        @blur="validateAndShowField('quantity')"
        :class="{ error: fieldErrors.quantity }"
      />
      <span v-if="fieldErrors.quantity" class="error-message">{{ fieldErrors.quantity }}</span>
    </div>

    <button 
      type="submit" 
      :disabled="isLoading || hasErrors"
      class="btn-submit"
    >
      {{ isLoading ? 'Добавление...' : 'Добавить товар' }}
    </button>

    <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
      <h4>Отладочная информация:</h4>
      <p>hasErrors: {{ hasErrors }}</p>
      <p>errors: {{ errors }}</p>
      <p>fieldErrors: {{ fieldErrors }}</p>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ProductFormData, ValidationErrors } from '@/types/product';

@Component
export default class ProductForm extends Vue {
  @Prop({ type: Boolean, default: false }) isLoading!: boolean;

  formData: ProductFormData = {
    name: '',
    category: '',
    price: null,
    quantity: null
  };

  errors: ValidationErrors = {};
  fieldErrors: ValidationErrors = {};

  get hasErrors(): boolean {
    const hasErrors = Object.keys(this.errors).length > 0;
    console.log('hasErrors computed:', hasErrors, 'errors:', this.errors);
    return hasErrors;
  }

  validateAndShowField(field: keyof ProductFormData): void {
    console.log('validateAndShowField:', field);
    this.validateField(field);
    
    if (this.errors[field]) {
      this.fieldErrors = {
        ...this.fieldErrors,
        [field]: this.errors[field]
      };
    } else {
      const newFieldErrors = { ...this.fieldErrors };
      delete newFieldErrors[field];
      this.fieldErrors = newFieldErrors;
    }

    console.log('After validation - errors:', this.errors, 'fieldErrors:', this.fieldErrors);
  }

  validateField(field: keyof ProductFormData): void {
    console.log('validateField:', field, 'value:', this.formData[field]);
    
    switch (field) {
      case 'name':
        this.validateName();
        break;
      case 'category':
        this.validateCategory();
        break;
      case 'price':
        this.validatePrice();
        break;
      case 'quantity':
        this.validateQuantity();
        break;
    }

    console.log('After validateField - errors:', this.errors);
  }

  validateName(): void {
    const name = this.formData.name;
    if (!name || name.trim().length === 0) {
      this.errors = { ...this.errors, name: 'Название обязательно' };
    } else if (name.trim().length < 3) {
      this.errors = { ...this.errors, name: 'Название должно содержать минимум 3 символа' };
    } else {
      const newErrors = { ...this.errors };
      delete newErrors.name;
      this.errors = newErrors;
    }
  }

  validateCategory(): void {
    const category = this.formData.category;
    if (!category) {
      this.errors = { ...this.errors, category: 'Категория обязательна' };
    } else {
      const newErrors = { ...this.errors };
      delete newErrors.category;
      this.errors = newErrors;
    }
  }

  validatePrice(): void {
    const price = this.formData.price;
    
    if (price === null || price === undefined) {
      this.errors = { ...this.errors, price: 'Цена обязательна' };
    } else if (price <= 0) {
      this.errors = { ...this.errors, price: 'Цена должна быть больше 0' };
    } else {
      const newErrors = { ...this.errors };
      delete newErrors.price;
      this.errors = newErrors;
    }
  }

  validateQuantity(): void {
    const quantity = this.formData.quantity;
    
    if (quantity === null || quantity === undefined) {
      this.errors = { ...this.errors, quantity: 'Количество обязательно' };
    } else if (quantity < 0) {
      this.errors = { ...this.errors, quantity: 'Количество не может быть отрицательным' };
    } else if (!Number.isInteger(quantity)) {
      this.errors = { ...this.errors, quantity: 'Количество должно быть целым числом' };
    } else {
      const newErrors = { ...this.errors };
      delete newErrors.quantity;
      this.errors = newErrors;
    }
  }

  validateAllFields(): void {
    console.log('validateAllFields started');
    this.validateName();
    this.validateCategory();
    this.validatePrice();
    this.validateQuantity();
    
    this.fieldErrors = { ...this.errors };
    console.log('validateAllFields finished - errors:', this.errors, 'fieldErrors:', this.fieldErrors);
  }

  submitForm(): void {
    console.log('submitForm started');
    this.validateAllFields();

    console.log('Before submit check - hasErrors:', this.hasErrors, 'errors:', this.errors);

    if (!this.hasErrors) {
      this.isLoading = true
      
      console.log('Form is valid, submitting...');

      const submitData = {
        name: this.formData.name,
        category: this.formData.category,
        price: Number(this.formData.price),
        quantity: Number(this.formData.quantity)
      };
      console.log('Emitting data:', submitData);
      this.$emit('submit', submitData);

      this.resetForm();
      
      this.isLoading = false
    } else {
      console.log('Form has errors, not submitting');
    }
  }

  resetForm(): void {
    console.log('resetForm');
    this.formData = {
      name: '',
      category: '',
      price: null,
      quantity: null
    };
    this.errors = {};
    this.fieldErrors = {};
  }
}
</script>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2196F3;
}

.form-group input.error,
.form-group select.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  min-height: 16px;
}

.btn-submit {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-submit:not(:disabled):hover {
  background: #1976D2;
}
</style>