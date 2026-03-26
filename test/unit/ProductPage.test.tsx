import { describe, it, expect, vi, beforeEach } from 'vitest';
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
const mockNotFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    mockNotFound();
    throw new Error('NEXT_NOT_FOUND');
  },
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

    const { render, screen } = await import('@testing-library/react');
    const Component = await ProductPage({ params: Promise.resolve({ id: '1' }) });
    render(Component);

    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  it('llama a notFound cuando la API falla', async () => {
    mockGetById.mockRejectedValue(new Error('Not found'));

    await expect(
      ProductPage({ params: Promise.resolve({ id: '999' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mockNotFound).toHaveBeenCalled();
  });

  it('pasa el id correcto al servicio', async () => {
    mockGetById.mockResolvedValue(productDetailMock);

    const { render } = await import('@testing-library/react');
    const Component = await ProductPage({ params: Promise.resolve({ id: '42' }) });
    render(Component);

    expect(mockGetById).toHaveBeenCalledWith('42');
  });
});
