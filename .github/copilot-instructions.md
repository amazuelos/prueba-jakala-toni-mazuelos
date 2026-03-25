<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Proyecto: Dulces Pétalos

Floristería online construida con Next.js 16 + TypeScript + Tailwind CSS v4.

### Arquitectura

DDD pragmática con capa de aplicación:
- `src/application/` — Casos de uso (GetAllProductsUseCase, GetProductByIdUseCase)
- `src/domain/` — Tipos, puertos (interfaces), servicios facade, rutas por dominio
- `src/infrastructure/` — Adapters (API), httpClient, endpoints
- `src/app/` — Páginas Next.js (App Router), componentes, hooks colocados con sus páginas

### Convenciones

- Server Components por defecto, `'use client'` solo cuando hay interactividad
- `generateMetadata` para SEO dinámico en páginas de detalle
- Tests unitarios con Vitest + Testing Library en `test/unit/`
- Tests E2E con Cypress en `test/e2e/cypress/`
- Variables de entorno con prefijo `NEXT_PUBLIC_` para cliente
- Español en UI y documentación
