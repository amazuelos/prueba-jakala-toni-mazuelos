/**
 * ProductRepository — Domain port
 *
 * Contrato que define cómo se obtienen productos.
 * La infraestructura provee la implementación concreta.
 */
import type { Product } from '../../types/product.types';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
}
