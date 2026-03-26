import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductService } from '@/domain/product/ProductService';
import { ProductDetailPageClient } from './ProductDetailPageClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await ProductService.getById(id);
    return {
      title: product.name,
      description: `${product.name} (${product.binomialName}) — €${product.price}. Compra online en Dulces Pétalos.`,
      openGraph: {
        title: product.name,
        description: `${product.binomialName} — €${product.price}`,
        images: [{ url: product.imgUrl }],
      },
    };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await ProductService.getById(id);
    return <ProductDetailPageClient product={product} />;
  } catch {
    notFound();
  }
}
