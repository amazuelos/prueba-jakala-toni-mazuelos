# 07 — Buscador de productos

---

## Qué se hizo

Se añadió un buscador que filtra productos por nombre o nombre científico,
ubicado en el centro del layout justo antes de la lista de productos.

### Buenas prácticas aplicadas

- **Componente presentacional puro** (`SearchBar`): solo recibe `value` y `onChange`, sin estado propio. Reutilizable en cualquier contexto.
- **Estado elevado** (lifting state up): el estado de búsqueda vive en `ProductListPageClient`, que es el Client Component que orquesta la interactividad.
- **Filtrado memorizado**: se usa `useMemo` dentro del hook para evitar recalcular el filtro en cada render si ni los items ni el término han cambiado.
- **Búsqueda case-insensitive con soporte de acentos**: normaliza con `NFD` + regex para que "orquidea" encuentre "Orquídea".

---

## Hook `useSearch` — por qué un hook genérico

### Decisión

La lógica de búsqueda (estado del término + filtrado memorizado) se extrajo a un
hook reutilizable `useSearch<T>` en lugar de mantenerla inline en el componente
cliente.

### Motivos

1. **Reutilizable para cualquier entidad**: al aceptar un genérico `<T>` y un array de `fields: (keyof T)[]`, el mismo hook sirve para buscar productos, categorías, usuarios o cualquier otro listado futuro. No está acoplado al dominio de productos.

2. **Separación de responsabilidades**: `ProductListPageClient` orquesta — recibe datos del Server Component, gestiona navegación con `useRouter`, compone `SearchBar` + `ProductList`. El hook se encarga exclusivamente de la lógica de filtrado.

3. **Normalización centralizada**: la función `normalize()` que elimina acentos/diacríticos (`NFD` + regex) vive dentro del hook. Si mañana necesitamos ajustar la normalización (ej: ignorar guiones), se toca en un único sitio.

4. **Testabilidad**: al ser un hook puro sin dependencias externas (no hace fetch ni accede a servicios), se puede testear de forma aislada con `renderHook`.

### Firma

```ts
function useSearch<T>(items: T[], fields: (keyof T)[]): {
  search: string;
  setSearch: (value: string) => void;
  filteredItems: T[];
}
```

### Ejemplo de uso

```ts
// Buscar productos por nombre y nombre científico
const { search, setSearch, filteredItems } = useSearch(products, ['name', 'binomialName']);

// Hipotético: buscar usuarios por nombre y email
const { search, setSearch, filteredItems } = useSearch(users, ['name', 'email']);
```

### Ubicación

`src/app/hooks/useSearch.ts` — dentro de la capa de presentación (`app/`),
al mismo nivel que `components/`. Los hooks de UI no pertenecen al dominio
ni a la infraestructura: son lógica de presentación reutilizable.

---

## Patrón Server → Client en el buscador

El fetch de productos se hace en el **Server Component** (`page.tsx`) y se pasa
como props al **Client Component** (`ProductListPageClient`). La búsqueda se
ejecuta enteramente en el cliente sin nuevas peticiones al servidor:

```
page.tsx (Server)
  └─ await ProductService.getAll()
       └─ products → ProductListPageClient (Client)
                       └─ useSearch(products, ['name', 'binomialName'])
                            └─ filteredItems → ProductList
```

Esto significa que el filtrado es instantáneo (no hay latencia de red) y funciona
con la lista completa que ya llegó en el HTML inicial.

---

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `src/app/hooks/useSearch.ts` | Hook genérico de búsqueda con normalización de acentos |
| `src/app/components/SearchBar.tsx` | Componente presentacional — input con icono de lupa (SVG posicionado con absolute) |
| `src/app/components/products/ProductListPageClient.tsx` | Client wrapper — usa `useSearch` + `useRouter` para filtrar y navegar |
| `src/app/assets/icons/search.svg` | Icono de lupa SVG |

---

## Estado de los tests

```
TypeScript:   Compila sin errores ✅
Unit Tests:   24 passed ✅
E2E Tests:    19 specs ✅
```
