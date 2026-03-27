# 🌸 Dulces Pétalos — Floristería Online

> **Demo en producción:** [dulces-petalos-sandy.vercel.app](https://dulces-petalos-sandy.vercel.app/)

Floristería online construida con **Next.js 16**, **TypeScript** y **Tailwind CSS v4**.  
Arquitectura **DDD pragmática** con SEO nativo vía Server Components y `generateMetadata`.

---

## Instalación y puesta en marcha

### Requisitos previos

- **Node.js** ≥ 22
- **npm** ≥ 10

### 1. Clonar el repositorio

```bash
git clone https://github.com/amazuelos/prueba-jakala-toni-mazuelos.git
cd prueba-jakala-toni-mazuelos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

El archivo `.env.example` ya contiene el valor por defecto de la API:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de la API de productos (`https://dulces-petalos.jakala.es/api/v1`) |

### 4. Arrancar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 5. Build de producción

```bash
npm run build
npm run start
```

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run test` | Tests unitarios (Vitest) |
| `npm run test:watch` | Tests unitarios en modo watch |
| `npm run test:e2e` | Tests E2E (Cypress GUI) |
| `npm run test:e2e:run` | Tests E2E (Cypress headless) |
| `npm run lint` | ESLint |

---

## Resumen técnico

### Arquitectura

Se sigue una **DDD pragmática** con cuatro capas que respetan la regla de dependencia:

```
Page (Server Component)
  → ProductService (facade)
    → UseCase (aplicación)
      → ProductRepository (puerto/interfaz)
        → ProductApiClient (adapter)
          → httpClient → fetch → API REST
```

- **Server Components** para SEO y fetch en servidor.
- **Client Components** (`'use client'`) solo para interactividad (búsqueda, navegación).
- **Try/catch en cada capa** con mensajes contextuales para trazabilidad de errores.

### Estructura de carpetas

```
src/
  types/             ← Tipos compartidos (Product)
  application/       ← Casos de uso (GetAllProducts, GetProductById)
  domain/            ← Puertos, facade, rutas de dominio
  infrastructure/    ← Adapters (API), httpClient, endpoints
  app/               ← Páginas Next.js + componentes colocados
```

### Testing

- **33 tests unitarios** — Vitest + Testing Library
- **22 tests E2E** — Cypress contra API real (sin cy.intercept, ya que el fetch es SSR)

### Stack

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| Next.js | 16.2.1 | Framework (App Router, SSR, Turbopack) |
| React | 19.2.4 | UI (Server + Client Components) |
| TypeScript | 5 | Tipado estricto |
| Tailwind CSS | v4 | Estilos utility-first |
| Vitest | 4.1.1 | Tests unitarios |
| Cypress | 15.13.0 | Tests E2E |
| Vercel | — | Despliegue |

---

## Documentación

Toda la documentación detallada está en la carpeta [`docs/`](./docs/):

| Documento | Contenido |
|-----------|-----------|
| [01 — Arquitectura](./docs/01-arquitectura.md) | DDD pragmática, capas, regla de dependencia, comparación con hexagonal estricta |
| [02 — Testing y Tailwind](./docs/02-herramientas-testing-tailwind.md) | Configuración de Vitest, Testing Library, Cypress y Tailwind v4 |
| [03 — Tests E2E](./docs/03-tests-e2e.md) | Estrategia E2E sin fixtures, data-testid mapping, specs |
| [04 — Consumo de API](./docs/04-arquitectura-consumo-api.md) | Flujo de datos, capas, patrón Server→Client, diagrama de dependencias |
| [05 — Variables de entorno](./docs/05-variables%20de%20entorno.md) | Convención Next.js, `.env.local`, `.env.example` |
| [06 — Layout](./docs/06-layout-structure.md) | Layout raíz, header, flexbox vertical, metadata SEO |
| [07 — Buscador](./docs/07-buscador-productos.md) | Hook genérico `useSearch<T>`, normalización de acentos, patrón Server→Client |
| [08 — Diseño general](./docs/08-diseño-general.md) | Cards, detalle, breadcrumbs, responsive grid |
| [09 — Decisiones técnicas](./docs/09-decisiones-tecnicas.md) | Justificación de cada decisión vinculada a los requisitos del proyecto |