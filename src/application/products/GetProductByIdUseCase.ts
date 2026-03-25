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

  execute(id: string): Promise<Product> {
    return this.repository.getById(id);
  }
}
