/**
 * ApiProductRepository — Infrastructure adapter
 *
 * Implementación concreta del puerto ProductRepository.
 * Consume la API REST de dulces-petalos.
 */
import type { Product } from '@/types/product.types';
import type { ProductRepository } from '@/domain/product/ProductRepository';
import { get } from '@/infrastructure/http/httpClient';
import { productEndpoints } from './productEndpoints';

export class ApiProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    return get<Product[]>(productEndpoints.getAll);
  }

  async getById(id: string): Promise<Product> {
    return get<Product>(productEndpoints.getById(id));
  }
}
