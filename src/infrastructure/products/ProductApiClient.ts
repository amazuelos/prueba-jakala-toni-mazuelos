/**
 * ProductApiClient — Infrastructure adapter
 *
 * Implementación concreta del puerto ProductRepository.
 * Consume la API REST de dulces-petalos.
 */
import type { Product } from '@/types/product.types';
import type { ProductRepository } from '@/domain/product/ProductRepository';
import { get } from '@/infrastructure/http/httpClient';
import { productEndpoints } from './productEndpoints';

export class ProductApiClient implements ProductRepository {
  async getAll(): Promise<Product[]> {
    try {
      return await get<Product[]>(productEndpoints.getAll);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`ProductApiClient.getAll: ${message}`);
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      return await get<Product>(productEndpoints.getById(id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`ProductApiClient.getById(${id}): ${message}`);
    }
  }
}
