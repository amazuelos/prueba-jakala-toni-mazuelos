/**
 * ProductDetailPageClient — Client wrapper
 *
 * Componente cliente para la interactividad del detalle (back, breadcrumbs).
 */
'use client';

import { useRouter } from 'next/navigation';

import type { Product } from '@/types/product.types';
import { ProductDetail } from '@/app/components/products/ProductDetail';

interface ProductDetailPageClientProps {
  product: Product;
  isNew?: boolean;
}

export function ProductDetailPageClient({ product, isNew = false }: ProductDetailPageClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return <ProductDetail product={product} onBack={handleBack} isNew={isNew} />;
}
