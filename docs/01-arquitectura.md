# Arquitectura — DDD Pragmática con Next.js

## Visión general

Este proyecto sigue una **DDD pragmática** adaptada a Next.js App Router.
Se inspira en la arquitectura hexagonal pero elimina ceremonias innecesarias
para un frontend, manteniendo la separación de responsabilidades que importa.

## Estructura de carpetas

```
src/
  types/              ← Tipos compartidos del dominio
  application/        ← Casos de uso (lógica de aplicación)
    products/
  domain/             ← Puertos (interfaces), servicios facade, rutas por dominio
    product/
  infrastructure/     ← Adapters (API), httpClient, endpoints
    http/
    products/
  app/                ← Next.js App Router (UI)
    assets/
    components/
    hooks/
    product/[id]/
```

## Capas y responsabilidades

### `types/`
Tipos TypeScript puros (`interface`, `type`). Sin lógica, sin dependencias.
Compartidos por todas las capas.

### `application/`
**Casos de uso**. Cada clase encapsula una operación de negocio y depende
solo del puerto (interface), nunca de la implementación concreta.

```
GetAllProductsUseCase  →  repository.getAll()
GetProductByIdUseCase  →  repository.getById(id)
```

### `domain/`
- **Puertos**: Interfaces que definen contratos (`ProductRepository`).
- **Service facade**: Ensambla adapter + use cases. Punto de entrada único.
- **Rutas de dominio**: Paths de navegación por dominio (`productRoutes`).

### `infrastructure/`
- **httpClient**: Cliente HTTP genérico (fetch + env vars).
- **Adapters**: Implementación concreta de los puertos (`ProductApiClient`).
- **Endpoints**: Configuración de paths de la API.

### `app/`
Capa de presentación gestionada por Next.js App Router:
- **Server Components** por defecto → SEO + SSR.
- **Client Components** (`'use client'`) solo para interactividad.
- **`generateMetadata`** para SEO dinámico.
- Componentes, hooks y assets colocados junto a sus páginas.

## Flujo de datos

```
[Next.js Page (Server Component)]
        ↓
  ProductService (facade)
        ↓
  UseCase.execute()
        ↓
  ProductRepository (port/interface)
        ↓
  ProductApiClient (adapter)
        ↓
  httpClient → fetch() → API REST
```

## Comparación con Arquitectura Hexagonal DDD estricta

| Aspecto | Hexagonal estricta | DDD pragmática (este proyecto) |
|---|---|---|
| **Entidades de dominio** | Clases con lógica de negocio (`Product.applyDiscount()`) | Interfaces TypeScript puras — el dominio no tiene lógica propia en frontend |
| **Value Objects** | Clases inmutables (`Price`, `Email`) | Tipos primitivos o types — la validación vive en el formulario o la API |
| **Puertos** | Interfaces en `domain/ports/` | Interfaces en `domain/` — mismo concepto, menos carpetas |
| **Adapters** | Separados en `primary` y `secondary` | Solo adapters de API en `infrastructure/` — en frontend solo consumimos datos |
| **Casos de uso** | En capa `application/` | ✅ Igual — `application/` con inyección del puerto |
| **Service facade** | A veces omitido, a veces en `domain/` | En `domain/` — ensambla adapter + use cases, punto de entrada único |
| **DI Container** | Inversify, tsyringe, etc. | Composición manual en el facade — suficiente para frontend |
| **Carpetas** | ~8-12 niveles de profundidad | ~3-4 niveles — fácil de navegar |
| **Capa anti-corrupción** | Mappers DTO → Entity | No necesaria — la API ya devuelve el formato que usamos |
| **Event bus / Domain events** | Pub/sub entre bounded contexts | No necesario — un solo bounded context |

## ¿Por qué pragmática y no estricta?

### 1. El frontend no tiene lógica de dominio compleja
En un backend, las entidades validan invariantes, aplican reglas de negocio y
emiten eventos. En nuestro frontend **mostramos datos y navegamos**. Las
entidades serían clases vacías (YAGNI).

### 2. Un solo bounded context
Tenemos "productos". No hay interacción entre contextos que justifique
event buses, agregados o capa anti-corrupción.

### 3. Next.js ya impone estructura
App Router dicta dónde van las páginas (`app/`). Pelear contra eso para
forzar una capa `presentation/` separada añade complejidad sin beneficio.

### 4. Mantenemos lo que importa
- **Puertos e interfaces** → desacoplamiento de la API.
- **Casos de uso** → lógica de aplicación testeable.
- **Service facade** → punto de entrada único, fácil de refactorizar.
- **Inyección por constructor** → testeable sin frameworks DI.

### 5. Escalable cuando haga falta
Si mañana hay lógica de dominio real (descuentos, stock, carritos), se
añaden entidades y value objects en `domain/`. La estructura lo permite
sin refactorizar.

## Regla de dependencia

```
app/ → domain/ → (interfaces puras)
         ↑
   application/ → domain/ (ports)
         ↑
   infrastructure/ → domain/ (implementa ports)
```

Ninguna capa interna conoce las externas. `domain/` nunca importa de
`infrastructure/` ni de `app/`. El facade en `domain/` ensambla, pero
las dependencias van hacia dentro.
