/**
 * useSearch — Shared hook
 *
 * Hook genérico de búsqueda con normalización de acentos.
 * Filtra una lista de items por los campos indicados.
 */
'use client';

import { useState, useMemo } from 'react';

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function useSearch<T>(items: T[], fields: (keyof T)[]) {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const term = normalize(search);
    if (!term) return items;

    return items.filter((item) =>
      fields.some((field) => {
        const value = item[field];
        return typeof value === 'string' && normalize(value).includes(term);
      }),
    );
  }, [items, fields, search]);

  return { search, setSearch, filteredItems };
}
