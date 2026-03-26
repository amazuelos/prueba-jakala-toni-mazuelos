import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDetail } from '@/app/components/products/ProductDetail';
import { productDetailMock } from './mocks/products';

// Mock next/image to render a plain img
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ProductDetail', () => {
  const onBack = vi.fn();

  const renderComponent = (isNew = false) =>
    render(<ProductDetail product={productDetailMock} onBack={onBack} isNew={isNew} />);

  it('renderiza el contenedor', () => {
    renderComponent();
    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  it('muestra el nombre del producto', () => {
    renderComponent();
    expect(screen.getByTestId('product-name')).toHaveTextContent('Orquídea');
  });

  it('muestra el nombre binomial', () => {
    renderComponent();
    expect(screen.getByTestId('product-binomial-name')).toHaveTextContent('Phalaenopsis');
  });

  it('muestra el precio', () => {
    renderComponent();
    expect(screen.getByTestId('product-price')).toHaveTextContent('€4.95');
  });

  it('renderiza la imagen', () => {
    renderComponent();
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', productDetailMock.imgUrl);
  });

  it('muestra los riegos por semana', () => {
    renderComponent();
    expect(screen.getByTestId('product-waterings')).toHaveTextContent('1');
  });

  it('muestra el tipo de fertilizante traducido', () => {
    renderComponent();
    expect(screen.getByTestId('product-fertilizer')).toHaveTextContent('fósforo');
  });

  it('muestra la altura', () => {
    renderComponent();
    expect(screen.getByTestId('product-height')).toHaveTextContent('60');
  });

  it('navega atrás con el breadcrumb', async () => {
    renderComponent();
    const user = userEvent.setup();
    await user.click(screen.getByTestId('product-detail-back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('muestra breadcrumbs con Inicio y nombre del producto', () => {
    renderComponent();
    const breadcrumbs = screen.getByTestId('breadcrumbs');
    expect(breadcrumbs).toBeInTheDocument();
    expect(screen.getByTestId('product-detail-back')).toHaveTextContent('Inicio');
    expect(breadcrumbs).toHaveTextContent('Orquídea');
  });
});
