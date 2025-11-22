import { ProductFormData } from '@/types/product';

const randomDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

export const mockApi = {
  async createProduct(productData: ProductFormData): Promise<{ success: boolean }> {

    // Тут типо POST запрос

    await randomDelay();
    return { success: true };
  },

  async deleteProduct(productId: number): Promise<{ success: boolean }> {

    // Тут типо DELETE запрос

    await randomDelay();
    return { success: true };
  }
}