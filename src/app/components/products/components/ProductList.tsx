/**
 * ProductList — Domain component
 *
 * Grid de tarjetas de producto.
 * Muestra imagen con badges (NUEVO + precio), nombre y nombre binomial.
 */
import Image from 'next/image';

import type { Product } from '@/types/product.types';
import goToArrow from '@/app/assets/icons/goToArrow.svg';

interface ProductListProps {
  products: Product[];
  onProductClick: (id: string, isNew: boolean) => void;
}

export function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <div data-testid="product-list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => {
        const isNew = index === 0;
        return (
          <button
            key={product.id}
            data-testid="product-card"
            onClick={() => onProductClick(String(product.id), isNew)}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md text-left"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                data-testid="product-card-image"
                src={product.imgUrl}
                alt={product.name}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {isNew && (
                <span className="absolute top-2 left-2 hidden rounded bg-green-600 px-2 py-0.5 text-xs font-bold text-white sm:inline-block">
                  NUEVO
                </span>
              )}
              <span data-testid="product-card-price" className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-0.5 text-sm font-semibold text-gray-800">
                €{product.price}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 data-testid="product-card-name" className="font-semibold text-gray-800">{product.name}</h3>
                <p data-testid="product-card-binomial-name" className="text-sm text-gray-500 italic">{product.binomialName}</p>
              </div>
              <Image
                src={goToArrow}
                alt=""
                width={20}
                height={20}
                className="text-gray-400 transition group-hover:translate-x-1"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-pink-300 bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-20 rounded-2xl"></div>
          </button>
        );
      })}
    </div>
  );
}
