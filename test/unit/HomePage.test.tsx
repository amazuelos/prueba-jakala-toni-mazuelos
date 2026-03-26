import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { productsMock } from './mocks/products';

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
const mockGetAll = vi.fn();
vi.mock('@/domain/product/ProductService', () => ({
  ProductService: {
    getAll: () => mockGetAll(),
  },
}));

// Import after mocks
import HomePage from '@/app/page';

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la lista de productos cuando la API responde', async () => {
    mockGetAll.mockResolvedValue(productsMock);

    const Component = await HomePage();
    render(Component);

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando la API falla', async () => {
    mockGetAll.mockRejectedValue(new Error('Network error'));

    const Component = await HomePage();
    render(Component);

    expect(screen.getByText('No se pudieron cargar los productos')).toBeInTheDocument();
    expect(screen.getByText('Inténtalo de nuevo más tarde.')).toBeInTheDocument();
  });

  it('no renderiza la lista de productos cuando la API falla', async () => {
    mockGetAll.mockRejectedValue(new Error('500'));

    const Component = await HomePage();
    render(Component);

    expect(screen.queryByTestId('product-list')).not.toBeInTheDocument();
  });
});
