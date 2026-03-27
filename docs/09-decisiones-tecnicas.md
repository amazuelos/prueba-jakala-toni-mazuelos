# 09 — Decisiones técnicas y justificación

## Contexto del proyecto

El enunciado pide una aplicación web para el catálogo de **Dulces Pétalos** con
dos vistas (listado y detalle). El alcance funcional es sencillo, pero se
valora explícitamente:

- Cómo se **estructura** el proyecto.
- Las **decisiones técnicas** que se toman.
- Cómo se piensa en la **evolución a medio y largo plazo**.
- Que más desarrolladores puedan **incorporarse sin fricción**.

Cada decisión de este documento responde a uno o varios de estos criterios.

---

## 1. Next.js 16 con App Router — ¿Por qué no Vite + React?

### Decisión

Se eligió **Next.js 16** (App Router, Server Components, Turbopack) en lugar de
Vite + React SPA.

### Motivos

| Criterio | SPA (Vite + React) | Next.js App Router |
|----------|-------------------|--------------------|
| **SEO** | Requiere SSR manual o prerendering externo | SEO nativo: Server Components + `generateMetadata` |
| **Performance** | Todo el fetch + render en el cliente | Fetch en el servidor, HTML completo en primera carga |
| **Bundle size** | API keys y lógica de fetch en el bundle del cliente | El fetch nunca llega al navegador |
| **Routing** | Librería externa (React Router) | Routing basado en filesystem, cero configuración |
| **Escalabilidad** | Hay que añadir SSR/SSG manualmente cuando se necesite | Ya está listo para ISR, SSG, streaming |
| **DX** | Rápido en dev, pero más decisiones manuales | Convenciones claras, menos decisiones |

**Una floristería online necesita SEO**: los productos deben ser indexables por
buscadores. Con Next.js, el HTML llega completo al crawler sin necesidad de
JavaScript en el cliente. Con una SPA, cada producto sería invisible para Google
hasta que se ejecute JS.

**Pensando en evolución**: si mañana se añade un carrito, checkout o blog,
Next.js ya tiene la infraestructura (API Routes, middleware, ISR). Con Vite
habría que montar todo desde cero.

### Trade-off asumido

Next.js añade complejidad (Server vs Client Components, `'use client'`, reglas
de serialización). Para una app de dos vistas esto podría parecer excesivo, pero
las bases que sienta justifican la inversión inicial.

---

## 2. Arquitectura DDD pragmática — ¿Por qué no hexagonal estricta?

### Decisión

Se sigue una **DDD pragmática** con cuatro capas (`types/`, `domain/`,
`application/`, `infrastructure/`) en lugar de una hexagonal estricta con
entidades, value objects, agregados y contenedor DI.

### Motivos

1. **El frontend no tiene lógica de dominio compleja.** No hay reglas de negocio
   como "aplicar descuento si el pedido supera 50€" o "no permitir más de 3 riegos
   al día". Nuestro dominio es: mostrar datos y navegar. Las entidades serían
   clases vacías (violación de YAGNI).

2. **Un solo bounded context.** Solo tenemos "productos". No hay interacción entre
   contextos que justifique event buses, agregados o capa anti-corrupción.

3. **Mantenemos lo que importa de DDD:**
   - **Puertos (interfaces)** → desacoplamiento de la API.
   - **Casos de uso** → lógica de aplicación explícita y testeable.
   - **Service facade** → punto de entrada único.
   - **Inyección por constructor** → testeable sin frameworks DI.
   - **Regla de dependencia** → las capas internas nunca importan de las externas.

4. **Escalable cuando haga falta.** Si mañana hay lógica de dominio real
   (descuentos, stock, carrito), se añaden entidades y value objects en `domain/`.
   La estructura lo permite sin refactorizar las capas existentes.

5. **Onboarding de nuevos desarrolladores.** 3-4 niveles de carpetas frente a
   8-12 de una hexagonal estricta. Un desarrollador nuevo puede entender la
   arquitectura en minutos.

### Comparación directa

| Aspecto | Hexagonal estricta | Este proyecto |
|---|---|---|
| Entidades de dominio | Clases con lógica (`Product.applyDiscount()`) | `interface Product` — tipo puro |
| Value Objects | `Price`, `Email` (clases inmutables) | Tipos primitivos |
| Contenedor DI | Inversify, tsyringe | Composición manual en facade |
| Carpetas | ~8-12 niveles | ~3-4 niveles |
| Capa anti-corrupción | Mappers DTO → Entity | No necesaria — la API ya devuelve nuestro formato |

---

## 3. Server Components + Client Components — El patrón Server → Client

### Decisión

Las páginas son **Server Components** que hacen el fetch y pasan los datos como
props a **Client Components** (`'use client'`) que gestionan la interactividad.

### Motivos

1. **El fetch nunca llega al navegador.** La API se consume en el servidor Node.js
   durante SSR. No se expone la URL de la API al cliente, no hay latencia
   adicional desde el browser, el bundle es más pequeño.

2. **SEO de caja.** El HTML que llega al crawler ya contiene todos los productos
   renderizados. `generateMetadata` genera meta tags dinámicos (título, descripción,
   Open Graph) por producto.

3. **Separación clara de responsabilidades:**
   - `page.tsx` → obtiene datos, define metadata, compone.
   - `*PageClient.tsx` → interactividad (búsqueda, navegación, `useRouter`).

4. **El buscador funciona sin red.** Los productos llegan ya resueltos al Client
   Component. El filtrado con `useSearch` es instantáneo (no hay fetch adicional).

```
page.tsx (Server) → await ProductService.getAll()
  └─ props → ProductListPageClient (Client)
               └─ useSearch() → filteredItems → ProductList
```

---

## 4. Gestión de errores — Try/catch en cada capa

### Decisión

Cada capa de la arquitectura tiene su propio `try/catch` que **captura, añade
contexto y relanza**. Las páginas (Server Components) capturan el error final y
muestran un fallback de UI.

### Flujo de error

```
httpClient       → "httpClient GET /product/99: HTTP 404: Not Found"
  ↓ catch + rethrow
ProductApiClient → "ProductApiClient.getById(99): httpClient GET /product/99: ..."
  ↓ catch + rethrow
UseCase          → "GetProductByIdUseCase(99): ProductApiClient.getById(99): ..."
  ↓ catch + rethrow
page.tsx         → catch → renderiza fallback UI
```

### Motivos

1. **Trazabilidad.** Cuando un error llega a la página, el mensaje indica
   exactamente qué capa falló, qué operación y con qué parámetros.

2. **Sin sobreingeniería.** No hay clases de error personalizadas (`HttpError`,
   `DomainError`), ni middleware de errores, ni error boundaries complejos.
   Solo `try/catch` nativo con `Error` estándar.

3. **Fallback de UI en las páginas:**
   - **Listado**: "No se pudieron cargar los productos. Inténtalo de nuevo más tarde."
   - **Detalle**: "Producto no encontrado. El producto que buscas no existe o no está disponible."

4. **`generateMetadata` también protegido.** Si la API falla al generar metadata
   dinámica, se devuelve un título genérico en lugar de romper la página.

---

## 5. TypeScript estricto — Tipado como documentación

### Decisión

TypeScript con tipado estricto en todo el proyecto. Los tipos del dominio
(`Product`) se comparten desde `src/types/` por todas las capas.

### Motivos

1. **Onboarding.** Un nuevo desarrollador puede leer `product.types.ts` y
   entender inmediatamente la forma de los datos sin consultar la API.

2. **Refactoring seguro.** Si la API cambia un campo (ej: `imgUrl` → `imageUrl`),
   TypeScript marca todos los puntos afectados en tiempo de compilación.

3. **Documentación viva.** Las interfaces de los puertos (`ProductRepository`)
   definen el contrato exacto que debe cumplir cualquier adapter. El tipado
   reemplaza la documentación que se queda obsoleta.

---

## 6. Tailwind CSS v4 — ¿Por qué utility-first?

### Decisión

Se usa **Tailwind CSS v4** (incluido por defecto en `create-next-app`) con
PostCSS. Sin `tailwind.config.ts` (Tailwind v4 no lo requiere).

### Motivos

1. **Cero CSS custom.** Todo el diseño se expresa con clases utility directamente
   en JSX. No hay archivos `.module.css` ni convenciones de nombrado (BEM, etc.).

2. **Colocation.** Los estilos viven junto al markup. Para entender cómo se ve un
   componente solo hay que leer un archivo.

3. **Consistencia.** Tailwind impone un sistema de diseño (espaciado, colores,
   tipografía) que evita valores arbitrarios y mantiene coherencia visual.

4. **Responsive nativo.** El layout de 3 columnas se resuelve con
   `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` sin media queries manuales.

5. **Bundle optimizado.** Tailwind v4 solo incluye las clases que se usan
   realmente. El CSS final es mínimo.

---

## 7. Testing — Vitest + Testing Library + Cypress

### Decisión

- **Unit tests:** Vitest + Testing Library (33 tests).
- **E2E tests:** Cypress contra la app real con API real (21 specs).

### ¿Por qué Vitest y no Jest?

| Criterio | Jest | Vitest |
|----------|------|--------|
| Configuración con Next.js | Requiere transformers, moduleNameMapper | Plugin `@vitejs/plugin-react` y funciona |
| Velocidad | Más lento (transformación con Babel) | HMR nativo, ejecución más rápida |
| Compatibilidad API | — | API compatible con Jest (describe, it, expect, vi) |
| Ecosistema | Más maduro | Creciendo rápido, comunidad activa |

### ¿Por qué Testing Library?

Se testean los componentes **como los usa el usuario**: buscando por texto,
por `data-testid`, por rol. No se testean implementaciones internas (estado,
refs, re-renders). Esto hace los tests resilientes a refactorizaciones.

### ¿Por qué Cypress sin intercept?

En Next.js App Router, el fetch se ejecuta en el **servidor** (Server
Components). Cypress solo intercepta peticiones del navegador, así que
`cy.intercept` no funciona con SSR. La estrategia pragmática:

1. Levantar la app completa (`npm run dev`).
2. Dejar que el servidor consulte la API real.
3. Hacer aserciones genéricas (`not.be.empty`, `contain.text('€')`, `match(/\d+/)`)
   para que los tests no se rompan si cambia el catálogo.

### Estrategia por capa

| Capa | Qué se testea | Herramienta |
|------|--------------|-------------|
| Componentes UI | Renderizado, interacción, props | Vitest + Testing Library |
| Server Components (pages) | Flujo feliz + error (try/catch) | Vitest (mock de ProductService) |
| Flujos E2E | Listado → búsqueda → detalle → volver | Cypress |

### Tests unitarios: qué se cubre

| Suite | Tests | Qué valida |
|-------|------:|------------|
| `ProductList` | 10 | Cards, nombres, precios, imágenes, click, empty state |
| `ProductDetail` | 10 | Nombre, binomial, precio, imagen, cuidados, breadcrumbs, navegación |
| `SearchBar` | 6 | Input, placeholder, value, onChange |
| `HomePage` | 3 | Renderizado con datos, error fallback, no muestra lista en error |
| `ProductPage` | 4 | Renderizado con datos, error fallback, no muestra detalle en error, id correcto |
| **Total** | **33** | |

### Tests E2E: qué se cubre

| Suite | Tests | Qué valida |
|-------|------:|------------|
| Product List | 10 | Listado, búsqueda, filtrado, cards, navegación, empty state |
| Product Detail | 10 | Detalle, breadcrumbs, datos, navegación back |
| Error handling | 2 | Producto inexistente, id inválido |
| **Total** | **22** | |

---

## 8. Responsive design — Grid adaptativo

### Decisión

El listado usa un grid CSS con breakpoints de Tailwind:
`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

### Motivos

1. **Cumple el requisito** de "máximo tres productos por fila, adaptándose de
   forma responsive".
2. **Mobile-first.** Una columna en móvil, dos en tablet, tres en desktop.
3. **Sin JavaScript.** El layout es puramente CSS, sin cálculos en runtime.

---

## 9. SEO — Metadata estática y dinámica

### Decisión

- **Listado:** `export const metadata` (estática) con título y descripción del
  catálogo.
- **Detalle:** `generateMetadata()` (dinámica) que consume la API para generar
  título, descripción y Open Graph con la imagen del producto.

### Motivos

1. **Indexabilidad.** Cada producto tiene su propia URL (`/product/:id`) con meta
   tags únicos. Google puede indexar cada producto individualmente.

2. **Open Graph.** Si alguien comparte un enlace de producto en redes sociales, se
   muestra el nombre, descripción e imagen del producto.

3. **Template de título.** El layout define `template: '%s | Dulces Pétalos'`, así
   cada página muestra su título seguido de la marca.

---

## 10. Variables de entorno — Configuración externalizada

### Decisión

La URL de la API se configura mediante `NEXT_PUBLIC_API_BASE_URL` en `.env.local`,
con un `.env.example` como plantilla versionada.

### Motivos

1. **Twelve-Factor App.** La configuración vive fuera del código. Se puede cambiar
   la API sin tocar código ni redesplegar.

2. **Seguridad.** `.env.local` está en `.gitignore`. Los secrets no llegan al
   repositorio. `.env.example` documenta qué variables se necesitan.

3. **Onboarding.** Un nuevo desarrollador ejecuta `cp .env.example .env.local` y
   tiene el proyecto funcionando.

4. **Multi-entorno.** Se puede apuntar a una API de staging, producción o mock
   local cambiando solo la variable de entorno.

---

## 11. Hook genérico `useSearch<T>` — Reutilización real

### Decisión

La lógica de búsqueda se extrajo a un hook genérico `useSearch<T>` que acepta
cualquier tipo de entidad y un array de campos por los que buscar.

### Motivos

1. **No está acoplado a productos.** El mismo hook sirve para buscar categorías,
   usuarios o cualquier otra entidad futura.

2. **Normalización centralizada.** La eliminación de acentos (`NFD` + regex) vive
   en un solo sitio. Si hay que ajustarla, se toca una vez.

3. **Filtrado memorizado.** `useMemo` evita recalcular el filtro si ni los items
   ni el término han cambiado.

4. **Testeable de forma aislada** con `renderHook` sin dependencias externas.

---

## 12. Despliegue en Vercel — CI/CD nativo

### Decisión

La aplicación se despliega en **Vercel** con deploy automático desde el
repositorio.

### Motivos

1. **Zero-config para Next.js.** Vercel es la plataforma del equipo que desarrolla
   Next.js. El deploy es inmediato sin configuración de build pipelines.

2. **Preview deployments.** Cada push a una rama genera una URL de preview para
   revisión antes de mergear.

3. **Variables de entorno.** Se configuran en el dashboard de Vercel para
   producción, sin exponer secrets en el código.

4. **CDN global.** Los assets estáticos se sirven desde el edge más cercano al
   usuario.

**URL pública:** https://dulces-petalos-sandy.vercel.app/

---

## 13. Conventional commits — Historial legible

### Decisión

Todos los commits siguen el formato **Conventional Commits**:
`tipo(scope): descripción`.

### Motivos

1. **Historial legible.** Cualquier desarrollador puede leer el log y entender qué
   se hizo, cuándo y en qué área.

2. **Changelog automático.** Herramientas como `standard-version` o `semantic-release`
   pueden generar changelogs a partir del historial.

3. **Revisión de PRs.** En proyectos con varios desarrolladores, los commits
   descriptivos facilitan el code review.

---

## 14. Estructura de carpetas — Colocation vs separación

### Decisión

Los componentes, hooks y assets de UI viven dentro de `src/app/` (colocation),
mientras que la lógica de negocio vive en capas separadas (`domain/`,
`application/`, `infrastructure/`).

### Motivos

1. **Next.js App Router espera colocation.** Las páginas, layouts y componentes
   de UI viven junto a sus rutas. Pelear contra esto genera complejidad.

2. **La lógica de negocio SÍ está separada.** `domain/`, `application/` e
   `infrastructure/` no dependen de `app/`. Se podrían reutilizar en otro
   frontend (mobile, CLI) sin cambios.

3. **Balance pragmático.** UI colocada donde Next.js la espera, negocio separado
   donde la arquitectura lo exige.

---

## 15. Gestión de estado vacío — Empty states

### Decisión

Cuando el buscador no encuentra resultados, se muestra un mensaje explícito
("No se encontraron productos") en lugar de un grid vacío.

### Motivos

1. **UX clara.** El usuario sabe que no hay resultados, no que la app está rota.
2. **Accesibilidad.** Un lector de pantalla anuncia el mensaje.
3. **Testeable.** El `data-testid="no-results"` permite verificar el estado vacío
   tanto en unit tests como en E2E.

---

## Resumen de stack y versiones

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| Next.js | 16.2.1 | Framework (App Router, SSR, Turbopack) |
| React | 19.2.4 | UI (Server + Client Components) |
| TypeScript | 5 | Tipado estricto |
| Tailwind CSS | v4 | Estilos utility-first |
| Vitest | 4.1.1 | Tests unitarios |
| Testing Library | 16.3.2 | Testing centrado en usuario |
| Cypress | 15.13.0 | Tests E2E |
| Vercel | — | Despliegue y hosting |
| Node.js | 22 | Runtime |
