/**
 * ProductService — Domain service (facade)
 *
 * Punto de entrada para operaciones del dominio de productos.
 * Ensambla adapter + use cases y expone métodos directos.
 */
import type { Product } from '../../types/product.types';
import { ApiProductRepository } from '@/infrastructure/products/ApiProductRepository';
import { GetAllProductsUseCase } from '@/application/products/GetAllProductsUseCase';
import { GetProductByIdUseCase } from '@/application/products/GetProductByIdUseCase';

const repository = new ApiProductRepository();
const getAllProducts = new GetAllProductsUseCase(repository);
const getProductById = new GetProductByIdUseCase(repository);

export const ProductService = {
  getAll(): Promise<Product[]> {
    return getAllProducts.execute();
  },
  getById(id: string): Promise<Product> {
    return getProductById.execute(id);
  },
};
