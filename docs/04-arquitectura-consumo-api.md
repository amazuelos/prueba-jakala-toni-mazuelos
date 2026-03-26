# 04 — Arquitectura de consumo de API

## Visión general

La aplicación consume la API REST de **dulces-petalos.jakala.es** siguiendo una
arquitectura DDD pragmática de tres capas. El flujo de datos es unidireccional:

```
Page (Server Component)
  → ProductService (facade)
    → UseCase (aplicación)
      → ProductRepository port (dominio)
        → ProductApiClient (infraestructura)
          → httpClient → fetch → API REST
```

La **regla de dependencia** se respeta: las capas internas (dominio, aplicación)
nunca importan de las externas. La infraestructura implementa los contratos
definidos por el dominio.

---

## Capas

### 1. Tipos — `src/types/product.types.ts`

```ts
export interface Product {
  id: number;
  name: string;
  binomialName: string;
  price: number;
  imgUrl: string;
  wateringsPerWeek: number;
  fertilizerType: string;
  heightInCm: number;
}
```

Tipo central compartido por todas las capas. Refleja 1:1 el contrato de la API.

### 2. Dominio — `src/domain/product/`

| Archivo | Rol |
|---------|-----|
| `ProductRepository.ts` | **Puerto** (interfaz) — define el contrato de acceso a datos |
| `ProductService.ts` | **Facade** — ensambla adapter + use cases y expone métodos directos |
| `productRoutes.ts` | Rutas de navegación del dominio (`/`, `/product/:id`) |

**ProductRepository** (puerto):

```ts
export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
}
```

**ProductService** (facade):

```ts
const repository = new ProductApiClient();
const getAllProducts = new GetAllProductsUseCase(repository);
const getProductById = new GetProductByIdUseCase(repository);

export const ProductService = {
  getAll()          → getAllProducts.execute(),
  getById(id)       → getProductById.execute(id),
};
```

El servicio es un **object literal** (no una clase) porque en Next.js Server
Components no hay estado ni ciclo de vida. Actúa como punto de entrada único
para las páginas.

### 3. Aplicación — `src/application/products/`

| Caso de uso | Método | Descripción |
|-------------|--------|-------------|
| `GetAllProductsUseCase` | `execute()` | Obtiene todos los productos |
| `GetProductByIdUseCase` | `execute(id)` | Obtiene un producto por ID |

Cada use case recibe el **puerto** `ProductRepository` por constructor
(inyección de dependencias manual). Esto permite sustituir la implementación
en tests sin tocar la lógica de aplicación.

```ts
export class GetAllProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}
  execute(): Promise<Product[]> {
    return this.repository.getAll();
  }
}
```

### 4. Infraestructura — `src/infrastructure/`

| Archivo | Rol |
|---------|-----|
| `http/httpClient.ts` | Cliente HTTP genérico (wrapper de `fetch`) |
| `products/productEndpoints.ts` | Paths de la API para productos |
| `products/ProductApiClient.ts` | **Adapter** — implementación concreta del puerto |

**httpClient**:

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}
```

- Lee la base URL de `NEXT_PUBLIC_API_BASE_URL` (`.env.local`).
- Genérico (`<T>`) para tipado seguro sin casteos manuales.
- Lanza error en respuestas no-ok para que las páginas puedan manejar fallos.

**productEndpoints**:

```ts
export const productEndpoints = {
  getAll: '/product',
  getById: (id: string) => `/product/${id}`,
};
```

Centraliza los paths para evitar strings dispersos por el código.

**ProductApiClient** (adapter):

```ts
export class ProductApiClient implements ProductRepository {
  async getAll(): Promise<Product[]> {
    return get<Product[]>(productEndpoints.getAll);
  }
  async getById(id: string): Promise<Product> {
    return get<Product>(productEndpoints.getById(id));
  }
}
```

Implementa el puerto del dominio usando `httpClient` + `productEndpoints`.

---

## Consumo desde las páginas (Server Components)

El fetch se ejecuta en el **servidor Node.js** durante SSR, nunca en el
navegador. Esto tiene implicaciones importantes:

### Listado — `src/app/page.tsx`

```ts
export default async function HomePage() {
  const products = await ProductService.getAll();
  return <ProductListPageClient products={products} />;
}
```

### Detalle — `src/app/product/[id]/page.tsx`

```ts
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await ProductService.getById(id);
  return <ProductDetailPageClient product={product} />;
}
```

Ambas páginas también definen **metadata estática o dinámica** para SEO
(`metadata` / `generateMetadata`).

### Patrón Server → Client

1. El **Server Component** (page) obtiene los datos y los pasa como props.
2. El **Client Component** (`'use client'`) recibe los datos ya resueltos y
   gestiona la interactividad (búsqueda, navegación).

Esto evita exponer la API al navegador, reduce el bundle del cliente y
mejora el SEO al servir HTML completo en la primera carga.

---

## Configuración de entorno

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://dulces-petalos.jakala.es/api/v1
```

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL de la API. Prefijo `NEXT_PUBLIC_` la hace accesible en cliente y servidor. |

---

## Diagrama de dependencias

```
src/types/product.types.ts          ← compartido por todas las capas
        ↑
src/domain/product/
  ├── ProductRepository.ts          ← puerto (interfaz)
  ├── ProductService.ts             ← facade (ensambla adapter + use cases)
  └── productRoutes.ts              ← rutas de navegación
        ↑
src/application/products/
  ├── GetAllProductsUseCase.ts      ← depende del puerto
  └── GetProductByIdUseCase.ts      ← depende del puerto
        ↑
src/infrastructure/
  ├── http/httpClient.ts            ← cliente HTTP genérico
  └── products/
      ├── productEndpoints.ts       ← paths de la API
      └── ProductApiClient.ts   ← adapter (implementa el puerto)
        ↑
src/app/
  ├── page.tsx                      ← Server Component → ProductService.getAll()
  └── product/[id]/page.tsx         ← Server Component → ProductService.getById()
```

## Implicaciones para testing

| Capa | Estrategia |
|------|-----------|
| **Unit tests** | Se mockean los componentes en aislamiento. No se prueba el fetch real. |
| **E2E (Cypress)** | Como el fetch es SSR, `cy.intercept` no lo captura. Los tests validan contra la API real (ver `docs/03-tests-e2e.md`). |
| **Use Cases** | Se podrían testear inyectando un mock de `ProductRepository` en el constructor. |

---

## API REST de referencia

| Endpoint | Método | Respuesta |
|----------|--------|-----------|
| `/product` | GET | `Product[]` — listado completo |
| `/product/:id` | GET | `Product` — detalle de un producto |

Base: `https://dulces-petalos.jakala.es/api/v1`
