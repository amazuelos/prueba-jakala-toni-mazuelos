import type { Metadata } from 'next';
import { ProductService } from '@/domain/product/ProductService';
import { ProductListPageClient } from './components/products/ProductListPageClient';

export const metadata: Metadata = {
  title: 'Catálogo de flores y plantas',
  description: 'Descubre nuestra selección de flores y plantas frescas. Orquídeas, rosas y mucho más.',
};

export default async function HomePage() {
  try {
    const products = await ProductService.getAll();
    return <ProductListPageClient products={products} />;
  } catch {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">No se pudieron cargar los productos</h2>
        <p className="mt-2 text-gray-500">Inténtalo de nuevo más tarde.</p>
      </div>
    );
  }
}
