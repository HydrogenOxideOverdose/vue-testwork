import { ProductFormData, ValidationErrors, ProductCategory } from '@/types/product';

export const validateProductForm = (formData: ProductFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Название обязательно';
  } else if (formData.name.trim().length < 3) {
    errors.name = 'Название должно содержать минимум 3 символа';
  }

  if (!formData.category) {
    errors.category = 'Категория обязательна';
  }

  if (formData.price === null || formData.price === undefined) {
    errors.price = 'Цена обязательна';
  } else if (formData.price <= 0) {
    errors.price = 'Цена должна быть больше 0';
  }

  if (formData.quantity === null || formData.quantity === undefined) {
    errors.quantity = 'Количество обязательно';
  } else if (formData.quantity < 0) {
    errors.quantity = 'Количество не может быть отрицательным';
  } else if (!Number.isInteger(formData.quantity)) {
    errors.quantity = 'Количество должно быть целым числом';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const validateField = (field: keyof ProductFormData, value: any): string | null => {
  const tempFormData: ProductFormData = {
    name: '',
    category: '',
    price: null,
    quantity: null,
    [field]: value
  };

  const errors = validateProductForm(tempFormData);
  return errors[field] || null;
};