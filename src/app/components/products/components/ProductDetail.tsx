/**
 * ProductDetail — Domain component
 *
 * Vista de detalle de un producto. Layout de dos columnas (desktop).
 * Imagen con badge opcional, información de cuidados traducida.
 */
import Image from 'next/image';

import type { Product } from '@/types/product.types';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

const fertilizerMap: Record<string, string> = {
  phosphorus: 'fósforo',
  nitrogen: 'nitrógeno',
  potassium: 'potasio',
};

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  isNew?: boolean;
}

export function ProductDetail({ product, onBack, isNew = false }: ProductDetailProps) {
  const fertilizer = fertilizerMap[product.fertilizerType] ?? product.fertilizerType;

  const breadcrumbItems = [
    { label: 'Inicio', onClick: onBack, testId: 'product-detail-back' },
    { label: product.name, testId: 'breadcrumb-1' },
  ];

  return (
    <div data-testid="product-detail" className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        {/* Imagen */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl md:w-1/2">
          <Image
            data-testid="product-detail-image"
            src={product.imgUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {isNew && (
            <span className="absolute top-3 left-3 rounded bg-green-600 px-3 py-1 text-sm font-bold text-white">
              NUEVO
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between md:w-1/2">
          <div>
            <h1 data-testid="product-name" className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p data-testid="product-binomial-name" className="mt-1 text-lg text-gray-500 italic">
              {product.binomialName}
            </p>
            <p data-testid="product-price" className="mt-4 text-2xl font-semibold text-green-700">
              €{product.price}
            </p>

            <div className="mt-6 space-y-3 text-gray-700">
              <p data-testid="product-waterings">
                <span className="font-medium">Riegos por semana:</span> {product.wateringsPerWeek}
              </p>
              <p data-testid="product-fertilizer">
                <span className="font-medium">Fertilizante:</span> {fertilizer}
              </p>
              <p className="sr-only" data-testid="product-height">
                Altura: {product.heightInCm} cm
              </p>
            </div>
          </div>

          <button className="mt-8 w-full rounded-lg bg-green-600 py-3 text-center font-semibold text-white transition hover:bg-green-700">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
