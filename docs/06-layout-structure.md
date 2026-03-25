# 06 — Layout y estructura visual

---

## Qué se hizo

Se definió el layout raíz de la aplicación en `src/app/layout.tsx` (Next.js App
Router), con un header minimalista y la estructura base de la página.

### Diseño

- **Header**: 66px de alto (`h-16.5`), fondo blanco, logo SVG centrado como enlace a home
- **Main**: `flex-1` para ocupar el espacio restante
- **Body**: `flex flex-col min-h-screen bg-gray-100` — flexbox vertical que asegura que el fondo cubra toda la pantalla independientemente del contenido

### Estructura del Layout

```
┌─────────────────────────────────┐
│           Header (66px)         │
│         [ 🌸 logo.svg ]        │
│          ↑ Link to /            │
├─────────────────────────────────┤
│                                 │
│           <main>                │
│         {children}              │
│                                 │
└─────────────────────────────────┘
```

### Archivos

| Archivo | Descripción |
|---------|-------------|
| `src/app/layout.tsx` | Layout raíz — Server Component con metadata SEO, header y main |
| `src/app/globals.css` | Estilos globales — `@import "tailwindcss"` (Tailwind v4) |
| `src/app/assets/icons/logo.svg` | Logo SVG de Dulces Pétalos |
| `src/app/assets/icons/search.svg` | Icono de lupa para la barra de búsqueda |

### Decisiones técnicas

**Logo como `<Image>` de Next.js:**
El SVG se importa como módulo (`import logo from './assets/icons/logo.svg'`) y
se renderiza con `<Image src={logo}>`. Next.js resuelve automáticamente el `src`,
`width` y `height` del import estático, optimizando la carga.

**`<Link href="/">` en el logo:**
Se usa el componente `Link` de Next.js para navegación client-side sin recargas
completas, manteniendo la experiencia SPA dentro de App Router.

**Icono de búsqueda posicionado con absolute:**
El `SearchBar` usa `<Image>` con posicionamiento absoluto (`absolute top-1/2 left-3
-translate-y-1/2`) para colocar el icono de lupa dentro del input.

**Metadata SEO:**
El layout define metadata con template de título (`%s | Dulces Pétalos`) que las
páginas hijas pueden personalizar vía `metadata` estática o `generateMetadata`.

```ts
export const metadata: Metadata = {
  title: {
    default: 'Dulces Pétalos — Floristería online',
    template: '%s | Dulces Pétalos',
  },
  description: 'Compra las mejores flores y plantas online.',
};
```

### Flexbox vertical para fondo completo

El body usa `flex flex-col min-h-screen` y el main `flex-1` para que el fondo
gris cubra toda la viewport aunque el contenido sea escaso. El header con
`shrink-0` evita que se comprima.

---

## Estado de los tests

```
TypeScript:   Compila sin errores ✅
Unit Tests:   24 passed ✅
E2E Tests:    19 specs ✅
```
