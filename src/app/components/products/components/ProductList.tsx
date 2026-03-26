/**
 * ProductList — Domain component
 *
 * Grid de tarjetas de producto.
 * Muestra nombre y nombre binomial arriba, imagen debajo con badges (NUEVO, precio) y flecha.
 */
import type { Product } from '@/types/product.types';

interface ProductListProps {
  products: Product[];
  onProductClick: (id: string, isNew: boolean) => void;
}

export function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <div data-testid="product-list">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            data-testid="product-card"
            className="relative bg-cover bg-no-repeat cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-lg"
            onClick={() => onProductClick(String(product.id), index === 0)}
          >
            <h2 data-testid="product-card-name" className="text-xl font-bold text-gray-900">
              {product.name}
            </h2>
            <p data-testid="product-card-binomial-name" className="mt-0.5 text-sm text-gray-400">
              {product.binomialName}
            </p>

            <div className="relative mt-4">
              <img
                data-testid="product-card-image"
                src={product.imgUrl}
                alt={product.name}
                className="h-56 w-full rounded-xl object-cover"
              />
              {index === 0 && (
                <span className="absolute top-3 right-3 hidden rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm sm:inline-block"
                  style={{ backgroundColor: 'rgba(156, 187, 169, 0.8)', color: '#2d4a37' }}
                >
                  NUEVO
                </span>
              )}
              <span data-testid="product-card-price" className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-900 backdrop-blur-sm">
                €{product.price}
              </span>
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-label="Go to product">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-pink-300 bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-20 rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
