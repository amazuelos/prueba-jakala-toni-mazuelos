# 08 — Diseño general: detalle de producto, breadcrumbs y cards

## Contexto

Se implementa el diseño visual completo de la aplicación: cards del listado con
nombre arriba e imagen debajo, página de detalle con layout de dos columnas,
breadcrumbs reutilizables, y header con logo como enlace a home.

---

## Decisiones tomadas

### 1. Componente `Breadcrumbs`

**Archivo:** `src/app/components/Breadcrumbs.tsx`

- Componente genérico y reutilizable que recibe un array de `BreadcrumbItem`.
- Cada item puede ser **clickable** (si tiene `onClick`) o **estático** (último breadcrumb).
- Separador visual con chevron `>`.
- Se soporta un `testId` opcional por item para facilitar testing.

```ts
interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  testId?: string;
}
```

### 2. Diseño de `ProductList` (cards)

**Archivo:** `src/app/components/products/components/ProductList.tsx`

Cada card muestra:

| Zona | Contenido |
|------|-----------|
| **Arriba** | Nombre (`h2`, bold) + nombre binomial (gris, italic) |
| **Abajo** | Imagen (`<img>`, `h-56`, `rounded-xl`, `object-cover`) |
| **Sobre imagen** | Badge NUEVO (primer producto, `backdrop-blur-sm`, verde apagado) |
| **Sobre imagen** | Precio (abajo-izquierda, pill blanca con blur) |
| **Sobre imagen** | Flecha SVG inline (abajo-derecha, pill blanca con blur) |
| **Overlay** | Rosa translúcido al hover (`bg-pink-300`, `opacity-0 → 0.20`) |

- Se usa `<img>` nativo en lugar de `<Image>` de Next.js (simplicidad, sin necesidad de optimización en listado).
- La flecha es un SVG inline (no import de archivo) para evitar dependencias externas.
- El badge NUEVO solo se muestra en el primer producto (`index === 0`).

### 3. Diseño de `ProductDetail`

**Archivo:** `src/app/components/products/components/ProductDetail.tsx`

Layout de **dos columnas** en desktop, una en mobile:

| Columna izquierda | Columna derecha |
|-------------------|-----------------|
| Imagen (`aspect-square`, `fill`, `rounded-xl`) con badge NUEVO opcional | Nombre, binomial, precio, cuidados, botón carrito |

| Aspecto | Implementación |
|---------|---------------|
| Navegación | Breadcrumbs `Inicio > [nombre producto]` |
| Precio | `€{price}` (formato con símbolo delante, color verde) |
| Fertilizante | Traducido al castellano vía mapa estático |
| Altura | `sr-only` (disponible para accesibilidad, oculto visualmente) |
| Botón carrito | `bg-[#7b3b5e]` (borgoña), `rounded-full` |

**Traducción de fertilizantes:**

```ts
const fertilizerMap: Record<string, string> = {
  phosphorus: 'fósforo',
  nitrogen: 'nitrógeno',
  potassium: 'potasio',
};
```

Si el tipo no se reconoce, se muestra el valor original como fallback.

### 4. Propagación de `isNew` para badge "NUEVO"

El badge solo se muestra en el primer producto del listado (`index === 0`).
Para que funcione también en la vista de detalle:

1. `ProductList` pasa `(id, isNew: boolean)` al callback `onProductClick`.
2. `ProductListPageClient` navega a `/product/:id` (el estado `isNew` no se
   persiste en la URL por simplicidad).
3. `ProductDetailPageClient` recibe `isNew` como prop (default `false`).

Si el usuario navega directamente a un detalle por URL, `isNew` será `false`,
que es el comportamiento esperado.

### 5. Logo como enlace a home

**Archivo:** `src/app/layout.tsx`

- El logo SVG se importa como módulo y se renderiza con `<Image>` de Next.js.
- Envuelto en `<Link href="/">` para navegación client-side sin recarga.
- `priority` porque está above-the-fold.

### 6. Layout con flexbox vertical

**Archivo:** `src/app/layout.tsx`

```tsx
<body className="flex min-h-screen flex-col bg-gray-100">
  <header className="flex h-16.5 shrink-0 items-center justify-center bg-white">
  <main className="flex-1">{children}</main>
</body>
```

- El body usa `flex flex-col min-h-screen` con fondo gris.
- El header tiene `shrink-0` para no comprimirse.
- El main usa `flex-1` para ocupar todo el espacio restante.
- El fondo gris cubre siempre el 100% de la viewport.

---

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `src/app/components/Breadcrumbs.tsx` | Componente reutilizable de breadcrumbs |
| `src/app/components/products/components/ProductDetail.tsx` | Detalle: dos columnas, imagen, cuidados, carrito |
| `src/app/components/products/components/ProductList.tsx` | Listado: cards con nombre arriba, imagen abajo |
| `src/app/components/products/ProductListPageClient.tsx` | Client wrapper: búsqueda + navegación |
| `src/app/product/[id]/ProductDetailPageClient.tsx` | Client wrapper: back + isNew |
| `src/app/layout.tsx` | Layout raíz: header con logo + flexbox vertical |

---

## Estado de los tests

```
TypeScript:   Compila sin errores ✅
Unit Tests:   24 passed ✅
E2E Tests:    19 specs ✅
```
