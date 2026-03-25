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

  execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
