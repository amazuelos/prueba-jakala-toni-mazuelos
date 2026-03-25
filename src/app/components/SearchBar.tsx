/**
 * SearchBar — Shared component
 *
 * Input de búsqueda con icono de lupa integrado.
 */
'use client';
import Image from 'next/image';
import search from '../assets/icons/search.svg';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <div data-testid="search-bar" className="relative w-full max-w-md">
      <Image src={search} alt="" width={16} height={16} className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
      <input
        data-testid="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none"
      />
    </div>
  );
}
