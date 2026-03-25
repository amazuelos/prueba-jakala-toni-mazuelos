import type { Metadata } from 'next';
import { ProductService } from '@/domain/product/ProductService';
import { ProductListPageClient } from './components/products/ProductListPageClient';

export const metadata: Metadata = {
  title: 'Catálogo de flores y plantas',
  description: 'Descubre nuestra selección de flores y plantas frescas. Orquídeas, rosas y mucho más.',
};

export default async function HomePage() {
  const products = await ProductService.getAll();

  return <ProductListPageClient products={products} />;
}
