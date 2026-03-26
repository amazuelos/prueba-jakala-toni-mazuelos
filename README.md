# 🌸 Dulces Pétalos — Floristería Online

Floristería online construida con **Next.js 16**, **TypeScript** y **Tailwind CSS v4**.  
Arquitectura **DDD pragmática** con SEO nativo vía Server Components y `generateMetadata`.

## Arquitectura

```
src/
  application/     ← Casos de uso (lógica de aplicación)
    products/
      GetAllProductsUseCase.ts
      GetProductByIdUseCase.ts
  domain/          ← Tipos, puertos, servicios facade, rutas por dominio
    product/
      product.types.ts
      ProductRepository.ts    (port)
      ProductService.ts       (facade → ensambla adapter + use cases)
      productRoutes.ts
  infrastructure/  ← Adapters, httpClient, endpoints
    http/
      httpClient.ts
    products/
      ProductApiClient.ts
      productEndpoints.ts
  app/             ← Páginas Next.js (App Router) + componentes colocados
    layout.tsx                              ← Layout global (header)
    page.tsx                                ← Listado (SSR + SEO)
    hooks/
      useSearch.ts
    components/
      SearchBar.tsx
      Breadcrumbs.tsx
      products/
        ProductListPageClient.tsx           ← Client wrapper listado
        components/
          ProductList.tsx
          ProductDetail.tsx
    product/[id]/
      page.tsx                              ← Detalle (SSR + SEO dinámico)
      ProductDetailPageClient.tsx           ← Client wrapper detalle
```

## Comandos

```bash
npm run dev          # Servidor de desarrollo (Turbopack)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run test         # Tests unitarios (Vitest)
npm run test:watch   # Tests unitarios en modo watch
npm run test:e2e     # Tests E2E (Cypress GUI)
npm run test:e2e:run # Tests E2E (Cypress headless)
npm run lint         # ESLint
```

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de la API de productos |

## Stack

- **Next.js 16** — App Router, Server Components, Turbopack
- **React 19** — Client/Server components
- **TypeScript 5** — Tipado estricto
- **Tailwind CSS v4** — Estilos utility-first
- **Vitest** — Tests unitarios con Testing Library
- **Cypress** — Tests E2E


### PUBLIC URL: https://dulces-petalos-sandy.vercel.app/