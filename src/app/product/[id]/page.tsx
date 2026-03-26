import type { Metadata } from 'next';
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
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Producto no encontrado</h2>
        <p className="mt-2 text-gray-500">El producto que buscas no existe o no está disponible.</p>
      </div>
    );
  }
}
