# Handoff: WorkFlow — Light Mode Toggle

Repo objetivo: **CesaV97/workflow** (React + TypeScript + CSS variables)

## Overview
Este handoff agrega un **toggle de tema claro/oscuro** a WorkFlow. Actualmente la app solo tiene dark mode (tokens en `src/styles/theme.css` bajo `:root`). La propuesta:

1. Reestructura los tokens existentes bajo un selector explícito `html[data-theme="dark"]`.
2. Añade un set paralelo de tokens para `html[data-theme="light"]` usando la paleta GitHub Light.
3. Expone un `ThemeContext` que lee/persiste la preferencia en `localStorage` y setea `data-theme` en `<html>`.
4. Añade un botón sun/moon en la TopBar que alterna entre modos.

## About the Design Files
Los archivos en este bundle (`WorkFlow Visualizacion.html`, `styles.css`, `components/`) son **referencias de diseño** creadas como un prototipo HTML/React standalone para validar la apariencia y comportamiento del toggle. **No son código para copiar directamente** al repo — están fuera del stack real (usan Babel in-browser, no TypeScript, no bundler).

La tarea es **portar los cambios** al codebase real `CesaV97/workflow` usando sus patrones establecidos (componentes funcionales con TS, CSS modules o el setup de estilos ya presente, Context API si ya se usa, o Zustand/Redux si ese es el patrón del repo).

## Fidelity
**High-fidelity.** Los valores de color, spacing, tipografía y animación son finales y se reprodujeron desde `src/styles/theme.css` del repo. Úsalos tal cual.

---

## Cambios requeridos por archivo

### 1. `src/styles/theme.css` — reestructurar tokens

**Estado actual:** Los tokens viven en `:root`. Esto impide definir un set alternativo sin duplicar toda la cascada.

**Cambio:** Mover los tokens de color a selectores `html[data-theme="..."]`, dejando en `:root` únicamente los tokens que **no cambian entre modos** (tipografía, spacing, radii, shadows, transitions, dimensiones).

```css
/* Tokens de color — dark (valores actuales del repo) */
html[data-theme="dark"] {
  --color-bg-primary: #0d1117;
  --color-bg-secondary: #161b22;
  --color-bg-tertiary: #21262d;
  --color-bg-sidebar: #010409;

  --color-text-primary: #c9d1d9;
  --color-text-secondary: #8b949e;

  --color-border: #30363d;

  --color-accent: #58a6ff;
  --color-success: #238636;
  --color-warning: #9e6a03;
  --color-danger: #da3633;
}

/* Tokens de color — light (nuevo, paleta GitHub Light) */
html[data-theme="light"] {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f6f8fa;
  --color-bg-tertiary: #eaeef2;
  --color-bg-sidebar: #f6f8fa;

  --color-text-primary: #1f2328;
  --color-text-secondary: #656d76;

  --color-border: #d0d7de;

  --color-accent: #0969da;
  --color-success: #1a7f37;
  --color-warning: #9a6700;
  --color-danger: #cf222e;
}

/* Tokens no-color que NO cambian entre modos — mantener en :root */
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'Monaco', 'Menlo', monospace;

  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 13px;
  --font-size-lg: 14px;
  --font-size-xl: 16px;
  --font-size-2xl: 20px;
  --font-size-3xl: 24px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);

  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;

  color-scheme: dark;
}

[data-theme="light"] { color-scheme: light; }
```

**Default de arranque:** añadir `<html data-theme="dark">` en `index.html` para evitar flash mientras JS hidrata el valor persistido. Alternativa: inline-script en `<head>` que lee localStorage y setea el atributo antes del render (ver más abajo).

---

### 2. Ajustes de componentes con colores hard-coded

Algunos componentes usan alphas o colores saturados que quedan mal sobre fondo blanco. Añade estas reglas `[data-theme="light"]` al final de `theme.css` (o al CSS del componente correspondiente):

```css
/* Status pills — bajar saturación/alpha para light mode */
[data-theme="light"] .status-to-do       { background: rgba(101,109,118,0.12); color: #656d76; }
[data-theme="light"] .status-in-progress { background: rgba(9,105,218,0.12);   color: #0969da; }
[data-theme="light"] .status-paused      { background: rgba(154,103,0,0.14);   color: #9a6700; }
[data-theme="light"] .status-blocked     { background: rgba(207,34,46,0.12);   color: #cf222e; }
[data-theme="light"] .status-done        { background: rgba(26,127,55,0.14);   color: #1a7f37; }

/* Project status badges */
[data-theme="light"] .project-status.active    { background: rgba(26,127,55,0.14);  color: #1a7f37; }
[data-theme="light"] .project-status.on-hold   { background: rgba(154,103,0,0.14);  color: #9a6700; }
[data-theme="light"] .project-status.completed { background: rgba(130,80,223,0.14); color: #8250df; }
[data-theme="light"] .project-status.archived  { background: rgba(101,109,118,0.14);color: #656d76; }

/* Progress bar track */
[data-theme="light"] .progress-track { background: #eaeef2; }

/* Activity heatmap (si existe) */
[data-theme="light"] .activity-cell    { background: #eaeef2; }
[data-theme="light"] .activity-cell.l1 { background: rgba(26,127,55,0.25); }
[data-theme="light"] .activity-cell.l2 { background: rgba(26,127,55,0.50); }
[data-theme="light"] .activity-cell.l3 { background: rgba(26,127,55,0.75); }
[data-theme="light"] .activity-cell.l4 { background: #1a7f37; }

/* Scrollbar */
[data-theme="light"] ::-webkit-scrollbar-thumb { background: #d0d7de; }
```

Los nombres de clase (`.status-to-do`, `.project-status.active`, etc.) vienen del prototipo — **ajusta a los nombres reales del repo**. Si el repo usa CSS modules, pon estas overrides en el archivo de estilos del componente correspondiente.

---

### 3. `src/context/ThemeContext.tsx` — nuevo archivo

Si el repo no tiene un patrón de Context establecido, crea este. Si ya hay un store (Zustand/Redux), integra el state ahí siguiendo el patrón existente.

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'wf_theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'dark'; // default del repo
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setThemeState(t => (t === 'dark' ? 'light' : 'dark'));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

---

### 4. `src/App.tsx` (o root del árbol) — envolver con provider

```tsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* resto del árbol */}
    </ThemeProvider>
  );
}
```

---

### 5. `index.html` — prevenir flash de tema incorrecto

Añade este script **antes** de cargar el bundle, para setear `data-theme` antes del primer paint:

```html
<script>
  (function() {
    try {
      var t = localStorage.getItem('wf_theme');
      document.documentElement.setAttribute('data-theme', (t === 'light' || t === 'dark') ? t : 'dark');
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

---

### 6. `src/components/layout/TopBar.tsx` (o similar) — añadir botón

Ubicación: en el contenedor de acciones de la TopBar, **antes** del botón "Nuevo" o del avatar del usuario (el orden exacto depende del diseño actual del repo).

```tsx
import { useTheme } from '../../context/ThemeContext';

// dentro del componente TopBar:
const { theme, toggleTheme } = useTheme();
const isDark = theme === 'dark';

// en el JSX, dentro de .topbar-actions (o equivalente):
<button
  className="icon-btn theme-toggle"
  onClick={toggleTheme}
  aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
  title={isDark ? 'Modo claro' : 'Modo oscuro'}
>
  {isDark ? (
    // Sun icon (Lucide/Feather style)
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  ) : (
    // Moon icon
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )}
</button>
```

**Estilos del botón** — si `.icon-btn` no existe ya en el repo, añade:

```css
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.icon-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}
```

---

## Interactions & Behavior

- **Click en el botón** → alterna `theme` entre `'dark'` y `'light'`.
- **Persistencia** → `localStorage.setItem('wf_theme', theme)` en cada cambio.
- **Al cargar la app** → lee `localStorage.getItem('wf_theme')` con fallback `'dark'`.
- **Transición** → el cambio es instantáneo (no hay CSS transition en `background-color` de `body`). Si quieres una transición suave, añade:
  ```css
  body { transition: background-color 180ms ease, color 180ms ease; }
  ```
  No recomendado para primera versión — puede causar flashes visuales en elementos anidados.
- **Iconografía** → sun cuando está en dark (indica "click para ir a claro"), moon cuando está en light.
- **Accesibilidad** → `aria-label` cambia con el estado; `title` muestra tooltip.

## State Management

- Una sola variable: `theme: 'dark' | 'light'`.
- Side effect: set DOM attribute + persist to localStorage.
- El resto de la UI reacciona a los CSS variables, no necesita saber del tema.

## Design Tokens

### Dark (existentes, no cambian)
| Token | Valor |
|---|---|
| `--color-bg-primary` | `#0d1117` |
| `--color-bg-secondary` | `#161b22` |
| `--color-bg-tertiary` | `#21262d` |
| `--color-bg-sidebar` | `#010409` |
| `--color-text-primary` | `#c9d1d9` |
| `--color-text-secondary` | `#8b949e` |
| `--color-border` | `#30363d` |
| `--color-accent` | `#58a6ff` |
| `--color-success` | `#238636` |
| `--color-warning` | `#9e6a03` |
| `--color-danger` | `#da3633` |

### Light (nuevos — paleta GitHub Light)
| Token | Valor |
|---|---|
| `--color-bg-primary` | `#ffffff` |
| `--color-bg-secondary` | `#f6f8fa` |
| `--color-bg-tertiary` | `#eaeef2` |
| `--color-bg-sidebar` | `#f6f8fa` |
| `--color-text-primary` | `#1f2328` |
| `--color-text-secondary` | `#656d76` |
| `--color-border` | `#d0d7de` |
| `--color-accent` | `#0969da` |
| `--color-success` | `#1a7f37` |
| `--color-warning` | `#9a6700` |
| `--color-danger` | `#cf222e` |

## Assets

Iconos SVG inline (sun/moon). No se necesitan assets externos ni dependencia de icon library — si el repo ya usa Lucide/Feather/Heroicons, reemplaza los SVGs inline por `<Sun />` y `<Moon />` de esa librería para consistencia.

## Files de referencia en este bundle

- `WorkFlow Visualizacion.html` — prototipo completo standalone (React via Babel). Muestra la TopBar con el toggle funcional, todas las vistas y el comportamiento de persistencia.
- `styles.css` — implementación de referencia del split `:root` / `html[data-theme="dark"]` / `html[data-theme="light"]` con todas las overrides. Úsalo como fuente de verdad para los valores exactos.
- `components/Shell.jsx` — contiene `TopBar` con el botón sun/moon (ver líneas alrededor de `className="icon-btn theme-toggle"`).

## Checklist de implementación

- [ ] Reestructurar `src/styles/theme.css` (tokens bajo `html[data-theme="..."]`)
- [ ] Crear `src/context/ThemeContext.tsx`
- [ ] Envolver root con `<ThemeProvider>`
- [ ] Añadir inline script en `index.html` (anti-flash)
- [ ] Añadir botón en TopBar
- [ ] Revisar componentes con colores hard-coded (status pills, progress bars, activity heatmap si existe) y añadir overrides `[data-theme="light"]`
- [ ] Smoke test: toggle funciona, persiste tras reload, no hay flash de tema incorrecto al recargar en modo light

## Notas

- El prototipo usa un único archivo CSS global. Si el repo usa CSS Modules o styled-components, adapta las overrides `[data-theme="light"]` al patrón del repo — los CSS variables siguen funcionando igual en todos.
- Si detectas más componentes con colores hard-coded al probar light mode (iconos en SVG con `fill` fijo, imágenes con fondo oscuro, etc.), añádelos a la lista de overrides o refactorialos para usar `currentColor` / tokens.
- Considera exponer la preferencia del sistema: `window.matchMedia('(prefers-color-scheme: light)').matches` como fallback cuando no hay valor en localStorage. No está en la primera iteración del prototipo pero es un enhancement fácil.
