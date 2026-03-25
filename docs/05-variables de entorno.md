# 05 — Variables de entorno

---

## Qué se hizo

Se extrajo la URL base de la API del código fuente a una variable de entorno,
siguiendo las convenciones de Next.js.

### Cambios realizados

1. **Creado `.env.local`** — Contiene la variable `NEXT_PUBLIC_API_BASE_URL` con el valor real de la API (excluido de git).
2. **Creado `.env.example`** — Plantilla para que otros desarrolladores sepan qué variables configurar (incluido en git).
3. **Actualizado `.gitignore`** — Patrón `.env*` excluye todos los `.env`, con excepción `!.env.example`.
4. **Actualizado `httpClient.ts`** — Lee la URL con `process.env.NEXT_PUBLIC_API_BASE_URL`.

### Convención Next.js

En Next.js, las variables de entorno se acceden mediante `process.env.NOMBRE`.
Para que una variable esté disponible **también en el cliente** (Client Components),
debe llevar el prefijo `NEXT_PUBLIC_`. Sin ese prefijo, solo es accesible en el servidor.

| Prefijo | Disponible en servidor | Disponible en cliente |
|---------|:---------------------:|:--------------------:|
| (ninguno) | ✅ | ❌ |
| `NEXT_PUBLIC_` | ✅ | ✅ |

> En este proyecto el fetch se ejecuta en Server Components (SSR), por lo que
> técnicamente no necesitaría el prefijo `NEXT_PUBLIC_`. Se mantiene por
> compatibilidad si en el futuro algún Client Component necesitara la URL.

### Variable

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://dulces-petalos.jakala.es/api/v1` | URL base de la API REST |

### Archivos

| Archivo | Descripción |
|---------|-------------|
| `.env.local` | Variables de entorno reales (excluido de git) |
| `.env.example` | Plantilla de referencia (incluido en git) |
| `src/infrastructure/http/httpClient.ts` | Usa `process.env.NEXT_PUBLIC_API_BASE_URL` |

### Configuración para nuevos desarrolladores

```bash
cp .env.example .env.local
```

---

## Estado de los tests

```
TypeScript:   Compila sin errores ✅
Unit Tests:   24 passed ✅
E2E Tests:    19 specs ✅
```
