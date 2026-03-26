/**
 * GetAllProductsUseCase — Application use case
 *
 * Caso de uso para obtener todos los productos.
 * Depende del puerto ProductRepository (inyección por constructor).
 */
import type { Product } from '@/types/product.types';
import type { ProductRepository } from '@/domain/product/ProductRepository';

export class GetAllProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`GetAllProductsUseCase: ${message}`);
    }
  }
}
