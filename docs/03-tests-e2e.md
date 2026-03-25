# 03 — Tests E2E con Cypress

## Objetivo

Validar los flujos principales de usuario (listado, búsqueda, navegación a detalle
y vuelta) sobre la aplicación desplegada, contra la **API real**.

## ¿Por qué sin fixtures (cy.intercept)?

En Next.js App Router los datos se obtienen en **Server Components** mediante
`fetch` en el servidor Node.js. Cypress solo intercepta peticiones que salen del
navegador, por lo que `cy.intercept` no captura las llamadas SSR.

La estrategia pragmática es:

1. Levantar la app (`npm run dev` o `npm run build && npm start`).
2. Dejar que el servidor consulte la API real.
3. Hacer aserciones genéricas (no vacío, contiene `€`, regex `\d+`) en lugar de
   valores fijos para que los tests sean resilientes a cambios de catálogo.

Los fixtures (`products.json`, `product-detail.json`) se conservan como
referencia de la forma del payload.

## Specs

| Archivo | Tests | Qué valida |
|---------|------:|------------|
| `product-list.cy.ts` | 9 | Renderizado del listado, barra de búsqueda, filtrado, cards con nombre/binomial/precio/imagen, navegación a detalle |
| `product-detail.cy.ts` | 10 | Renderizado del detalle, breadcrumbs, nombre, binomial, precio, imagen, riegos, fertilizante, altura, vuelta al listado |

**Total: 19 tests E2E**

## Data-testid mapping

### Listado (`ProductList`)

| testid | Elemento |
|--------|----------|
| `product-list` | Contenedor grid |
| `product-card` | Botón de cada card |
| `product-card-name` | Nombre (h3) |
| `product-card-binomial-name` | Nombre binomial (p) |
| `product-card-price` | Precio (span) |
| `product-card-image` | Imagen (Image) |

### Búsqueda (`SearchBar`)

| testid | Elemento |
|--------|----------|
| `search-bar` | Contenedor |
| `search-input` | Input de búsqueda |

### Detalle (`ProductDetail`)

| testid | Elemento |
|--------|----------|
| `product-detail` | Contenedor principal |
| `product-detail-image` | Imagen del producto |
| `product-name` | Nombre (h1) |
| `product-binomial-name` | Nombre binomial |
| `product-price` | Precio |
| `product-waterings` | Riegos/semana |
| `product-fertilizer` | Fertilizante |
| `product-height` | Altura (sr-only) |

### Breadcrumbs

| testid | Elemento |
|--------|----------|
| `breadcrumbs` | Nav contenedor |
| `product-detail-back` | Botón "Inicio" |
| `breadcrumb-1` | Nombre del producto (span) |

## Ejecución

```bash
# 1. Levantar la app
npm run dev

# 2. Ejecutar Cypress (headless)
npx cypress run

# 3. Ejecutar Cypress (interactivo)
npx cypress open
```

## Configuración

`cypress.config.ts`:

- `baseUrl`: `http://localhost:3000`
- `specPattern`: `test/e2e/cypress/**/*.cy.ts`
- `fixturesFolder`: `test/e2e/cypress/fixtures`
- `supportFile`: `false` (no se necesita setup adicional)
