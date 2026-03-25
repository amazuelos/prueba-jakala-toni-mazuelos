import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/app/components/SearchBar';

describe('SearchBar', () => {
  const onChange = vi.fn();

  it('renderiza el contenedor', () => {
    render(<SearchBar value="" onChange={onChange} />);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('renderiza el input', () => {
    render(<SearchBar value="" onChange={onChange} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('muestra el valor actual', () => {
    render(<SearchBar value="rosa" onChange={onChange} />);
    expect(screen.getByTestId('search-input')).toHaveValue('rosa');
  });

  it('usa placeholder personalizado', () => {
    render(<SearchBar value="" onChange={onChange} placeholder="Buscar flores..." />);
    expect(screen.getByPlaceholderText('Buscar flores...')).toBeInTheDocument();
  });

  it('usa placeholder por defecto', () => {
    render(<SearchBar value="" onChange={onChange} />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('llama a onChange al escribir', async () => {
    render(<SearchBar value="" onChange={onChange} />);
    const user = userEvent.setup();
    await user.type(screen.getByTestId('search-input'), 'o');
    expect(onChange).toHaveBeenCalledWith('o');
  });
});
