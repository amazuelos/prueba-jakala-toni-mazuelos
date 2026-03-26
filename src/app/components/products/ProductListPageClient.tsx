/**
 * ProductListPageClient — Client wrapper
 *
 * Componente cliente que recibe productos del server component
 * y gestiona la búsqueda interactiva.
 */
'use client';

import { useRouter } from 'next/navigation';

import type { Product } from '@/types/product.types';
import { productRoutes } from '@/domain/product/productRoutes';
import { useSearch } from '@/app/hooks/useSearch';
import { SearchBar } from '@/app/components/SearchBar';
import { ProductList } from './ProductList';

interface ProductListPageClientProps {
  products: Product[];
}

const SEARCH_FIELDS: (keyof Product)[] = ['name', 'binomialName'];

export function ProductListPageClient({ products }: ProductListPageClientProps) {
  const router = useRouter();
  const { search, setSearch, filteredItems } = useSearch(products, SEARCH_FIELDS);

  const handleProductClick = (id: string) => {
    router.push(productRoutes.detail(id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex justify-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar flores..." />
      </div>
      <ProductList products={filteredItems} onProductClick={handleProductClick} />
    </div>
  );
}
