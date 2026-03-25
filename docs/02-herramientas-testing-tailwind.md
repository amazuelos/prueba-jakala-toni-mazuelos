# Herramientas de testing y estilos

## Tailwind CSS v4

Ya viene preconfigurado con `create-next-app` (flag `--tailwind`).

### Configuración

Tailwind v4 usa PostCSS y no requiere `tailwind.config.ts`:

**`postcss.config.mjs`**
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**`src/app/globals.css`**
```css
@import "tailwindcss";
```

### Dependencias

```
@tailwindcss/postcss: ^4
tailwindcss: ^4
```

Ya incluidas por `create-next-app`. No hace falta instalar nada adicional.

---

## Vitest + Testing Library

### Instalación

```bash
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Configuración

**`vitest.config.ts`**
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/unit/setup.ts'],
    include: ['test/unit/**/*.test.{ts,tsx}'],
  },
});
```

**`test/unit/setup.ts`**
```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

> **Nota**: El `cleanup()` explícito es necesario para evitar que los renders
> se acumulen entre tests del mismo `describe`.

### Scripts en package.json

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Mock de `next/image`

En tests unitarios, `next/image` no funciona en jsdom. Se mockea con un `<img>` plano:

```ts
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));
```

---

## Cypress

### Instalación

```bash
npm install -D cypress
```

### Configuración

**`cypress.config.ts`**
```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'test/e2e/cypress/**/*.cy.ts',
    fixturesFolder: 'test/e2e/cypress/fixtures',
    supportFile: false,
  },
});
```

### Scripts en package.json

```json
{
  "test:e2e": "cypress open",
  "test:e2e:run": "cypress run"
}
```

---

## Estructura de tests

```
test/
  unit/
    setup.ts                  ← Setup global (jest-dom + cleanup)
    mocks/
      products.ts             ← Datos mock compartidos
    ProductList.test.tsx      ← 8 tests
    ProductDetail.test.tsx    ← 10 tests
    SearchBar.test.tsx        ← 6 tests
  e2e/
    cypress/                  ← (pendiente) Tests E2E
```

---

## Enfoque TDD

Se sigue el ciclo **RED → GREEN → REFACTOR**:

### 1. RED — Escribir el test primero

Los tests se escriben **antes** de la implementación. Definen el contrato
que debe cumplir cada componente:

```ts
// Ejemplo: ProductList debe renderizar tantas cards como productos
it('muestra tantas cards como productos', () => {
  renderComponent();
  expect(screen.getAllByTestId('product-card')).toHaveLength(productsMock.length);
});
```

### 2. GREEN — Implementar lo mínimo

Se implementa el componente con el código mínimo para que el test pase.

### 3. REFACTOR — Mejorar sin romper

Se mejora el código (extraer hooks, componentes, etc.) manteniendo los
tests en verde.

### Tests unitarios actuales (24 tests)

**ProductList** (8 tests):
- Renderiza el contenedor (`data-testid="product-list"`)
- Muestra tantas cards como productos
- Muestra un subconjunto filtrado
- Muestra el nombre del producto
- Muestra el nombre binomial
- Muestra el precio con €
- Renderiza la imagen del producto
- Llama a `onProductClick` con id y flag `isNew` al hacer click

**ProductDetail** (10 tests):
- Renderiza el contenedor (`data-testid="product-detail"`)
- Muestra el nombre del producto
- Muestra el nombre binomial
- Muestra el precio
- Renderiza la imagen
- Muestra los riegos por semana
- Muestra el tipo de fertilizante traducido (phosphorus → fósforo)
- Muestra la altura (en `sr-only` para accesibilidad)
- Navega atrás con el breadcrumb (botón "Inicio")
- Muestra breadcrumbs con "Inicio" y nombre del producto

**SearchBar** (6 tests):
- Renderiza el contenedor (`data-testid="search-bar"`)
- Renderiza el input (`data-testid="search-input"`)
- Muestra el valor actual
- Usa placeholder personalizado
- Usa placeholder por defecto ("Buscar...")
- Llama a `onChange` al escribir

### Mock de datos

```ts
// test/unit/mocks/products.ts
export const productsMock: Product[] = [
  {
    id: 1,
    name: 'Orquídea',
    binomialName: 'Phalaenopsis',
    price: 4.95,
    imgUrl: '...',
    wateringsPerWeek: 1,
    fertilizerType: 'phosphorus',
    heightInCm: 60,
  },
  {
    id: 2,
    name: 'Rosa de damasco',
    binomialName: 'Rosa damascena',
    price: 14.95,
    imgUrl: '...',
    wateringsPerWeek: 3,
    fertilizerType: 'nitrogen',
    heightInCm: 120,
  },
];

export const productDetailMock: Product = productsMock[0];
```
