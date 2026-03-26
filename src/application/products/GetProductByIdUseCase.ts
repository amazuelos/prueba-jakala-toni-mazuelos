/**
 * GetProductByIdUseCase — Application use case
 *
 * Caso de uso para obtener un producto por su ID.
 * Depende del puerto ProductRepository (inyección por constructor).
 */
import type { Product } from '@/types/product.types';
import type { ProductRepository } from '@/domain/product/ProductRepository';

export class GetProductByIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`GetProductByIdUseCase(${id}): ${message}`);
    }
  }
}
