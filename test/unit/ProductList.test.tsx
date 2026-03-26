import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductList } from '@/app/components/products/ProductList';
import { productsMock } from './mocks/products';

// Mock next/image to render a plain img
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ProductList', () => {
  const onProductClick = vi.fn();

  const renderComponent = (products = productsMock) =>
    render(<ProductList products={products} onProductClick={onProductClick} />);

  it('renderiza el contenedor', () => {
    renderComponent();
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('muestra tantas cards como productos', () => {
    renderComponent();
    expect(screen.getAllByTestId('product-card')).toHaveLength(productsMock.length);
  });

  it('muestra un subconjunto filtrado', () => {
    renderComponent([productsMock[0]]);
    expect(screen.getAllByTestId('product-card')).toHaveLength(1);
  });

  it('muestra el nombre del producto', () => {
    renderComponent();
    expect(screen.getByText('Orquídea')).toBeInTheDocument();
  });

  it('muestra el nombre binomial', () => {
    renderComponent();
    expect(screen.getByText('Phalaenopsis')).toBeInTheDocument();
  });

  it('muestra el precio con €', () => {
    renderComponent();
    expect(screen.getByText('€4.95')).toBeInTheDocument();
  });

  it('renderiza la imagen del producto', () => {
    renderComponent();
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', productsMock[0].imgUrl);
  });

  it('llama a onProductClick con id al hacer click', async () => {
    renderComponent();
    const user = userEvent.setup();
    const cards = screen.getAllByTestId('product-card');
    await user.click(cards[0]);
    expect(onProductClick).toHaveBeenCalledWith(String(productsMock[0].id), true);
  });

  it('muestra mensaje de "sin resultados" cuando no hay productos', () => {
    renderComponent([]);
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument();
  });

  it('no muestra mensaje de "sin resultados" cuando hay productos', () => {
    renderComponent();
    expect(screen.queryByTestId('no-results')).not.toBeInTheDocument();
  });
});
