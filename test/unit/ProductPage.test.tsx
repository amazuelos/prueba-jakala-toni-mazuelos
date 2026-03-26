import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { productDetailMock } from './mocks/products';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock ProductService
const mockGetById = vi.fn();
vi.mock('@/domain/product/ProductService', () => ({
  ProductService: {
    getById: (id: string) => mockGetById(id),
  },
}));

// Import after mocks
import ProductPage from '@/app/product/[id]/page';

describe('ProductPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el detalle cuando la API responde', async () => {
    mockGetById.mockResolvedValue(productDetailMock);

    const Component = await ProductPage({ params: Promise.resolve({ id: '1' }) });
    render(Component);

    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando la API falla', async () => {
    mockGetById.mockRejectedValue(new Error('Not found'));

    const Component = await ProductPage({ params: Promise.resolve({ id: '999' }) });
    render(Component);

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByText('El producto que buscas no existe o no está disponible.')).toBeInTheDocument();
  });

  it('no renderiza el detalle cuando la API falla', async () => {
    mockGetById.mockRejectedValue(new Error('500'));

    const Component = await ProductPage({ params: Promise.resolve({ id: '999' }) });
    render(Component);

    expect(screen.queryByTestId('product-detail')).not.toBeInTheDocument();
  });

  it('pasa el id correcto al servicio', async () => {
    mockGetById.mockResolvedValue(productDetailMock);

    const Component = await ProductPage({ params: Promise.resolve({ id: '42' }) });
    render(Component);

    expect(mockGetById).toHaveBeenCalledWith('42');
  });
});
