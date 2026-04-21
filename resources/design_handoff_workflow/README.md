# Handoff: WorkFlow — Full Design Integration

Repo objetivo: **CesaV97/workflow**

## Overview

Este handoff cubre el **diseño completo** del prototipo visual de WorkFlow mostrado en el preview: Dashboard, Proyectos, Tareas, Panel de Detalle de Tarea (con Pomodoro funcional), Reportes, Configuración, y toggle de tema dark/light.

El objetivo es que Claude Code (o un humano) lo tome y lo integre al codebase real siguiendo los patrones ya establecidos en el repo (React + TypeScript, CSS variables en `src/styles/theme.css`, estructura de `src/components`, `src/data`, etc.).

## About the Design Files

Los archivos en este bundle son **referencias de diseño** — un prototipo React standalone que corre con Babel in-browser, sin bundler ni TypeScript. **No son código para copiar verbatim**. Úsalos como:

- `WorkFlow Visualizacion.html` — root de la app; muestra la composición general y el wiring de estado (view + selectedTask + theme).
- `styles.css` — fuente de verdad para tokens, layouts y utilidades. Contiene el split `html[data-theme="dark"]` / `html[data-theme="light"]`.
- `components/*.jsx` — componentes del prototipo:
  - `Icons.jsx` — librería de íconos SVG inline (sun, moon, search, filter, bell, plus, dashboard, folder, check, chart, gear, clock, play, pause, stop, etc.)
  - `Shell.jsx` — `Sidebar` + `TopBar` + `ThemeToggle`
  - `Dashboard.jsx` — KPIs con sparklines, proyectos activos, tareas de la semana
  - `Projects.jsx` — grid de proyectos con tags/miembros/progreso
  - `Tasks.jsx` — lista con filtros por estatus y proyecto
  - `TaskDetail.jsx` — panel deslizable con Pomodoro (ring animado, start/pause/stop)
  - `Reports.jsx` — distribución trabajo/descanso, barras 14 días, heatmap, sesiones recientes
- `data.js` — seed data con shape esperado para `projects`, `tasks`, `sessions`, `comments`.

Portalo al stack real del repo. Si el repo usa CSS Modules / styled-components / Tailwind, adapta los selectores — los CSS variables funcionan igual en todos.

## Fidelity

**High-fidelity.** Todos los colores, spacings, radios, tipografías y animaciones son finales. Los valores vienen de o son consistentes con `src/styles/theme.css` del repo.

---

## Arquitectura general

### Shell / Layout

```
┌─────────────────────────────────────────────────────┐
│ Sidebar (220px) │ TopBar (56px)                     │
│                 ├───────────────────────────────────┤
│  ⚡ WorkFlow    │                                   │
│                 │                                   │
│  Dashboard      │  <App content>                    │
│  Proyectos      │                                   │
│  Tareas    [3]  │                                   │
│  Reportes       │                                   │
│  Configuración  │                                   │
│                 │                                   │
│  ─────────      │                                   │
│  CV  user info  │                                   │
└─────────────────┴───────────────────────────────────┘
```

- `Sidebar` fijo izquierdo, 220px, fondo `--color-bg-sidebar` (#010409 dark / #f6f8fa light).
- `TopBar` 56px, fondo `--color-bg-secondary`, con search central, íconos de acción (filter, bell, theme toggle), botón "Nueva tarea" (accent), avatar.
- Contenido principal scrolleable.
- Panel lateral derecho (`TaskDetailPanel`, 400px) se abre sobre el contenido cuando `selectedTask != null`.

### Estado global

```ts
{
  view: 'dashboard' | 'projects' | 'tasks' | 'reports' | 'settings',  // persist localStorage 'wf_view'
  selectedTask: Task | null,
  theme: 'dark' | 'light',  // persist localStorage 'wf_theme'
}
```

### Entidades

Ver `data.js` para shape completo. Resumen:

```ts
type Project = {
  id: string;
  name: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
  description: string;
  startDate: string;  // ISO date
  endDate: string;    // ISO date
  progress: number;   // 0-100
  taskCount: number;
  doneCount: number;
  createdAt: string;  // ISO datetime
  tags: string[];
  members: string[];  // iniciales, 2 chars
};

type Task = {
  id: string;
  title: string;
  projectId: string;
  status: 'To Do' | 'In Progress' | 'Paused' | 'Blocked' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;        // ISO date
  estimatedPomodoros: number;
  completedPomodoros: number;
  tags: string[];
};

type Session = {
  id: string;
  taskId: string;
  startedAt: string;   // ISO datetime
  duration: number;    // minutos
  type: 'focus' | 'short_break' | 'long_break';
  completed: boolean;
};

type Comment = {
  id: string;
  taskId: string;
  author: string;  // iniciales
  text: string;
  createdAt: string;
};
```

Si el repo ya tiene estos types, **usa los del repo** y adapta el mock data.

---

## Design Tokens

### Dark (existentes en `src/styles/theme.css`)
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

### Light (nuevos — GitHub Light palette)
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

### Tipografía, spacing, radii (no cambian entre modos)

```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'Monaco', 'Menlo', monospace;

--font-size-xs: 11px; --font-size-sm: 12px; --font-size-base: 13px;
--font-size-lg: 14px; --font-size-xl: 16px; --font-size-2xl: 20px; --font-size-3xl: 24px;

--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
--space-5: 20px; --space-6: 24px; --space-7: 32px; --space-8: 40px;

--radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px; --radius-xl: 12px;

--shadow-md: 0 4px 6px rgba(0,0,0,0.2);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.3);

--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;

--sidebar-width: 220px;
--task-panel-width: 400px;
--topbar-height: 56px;
```

### Reestructurar `theme.css`

Mover los tokens de color de `:root` a `html[data-theme="dark"]` y añadir el bloque `html[data-theme="light"]`. Mantener el resto en `:root`. Añadir:

```css
[data-theme="light"] { color-scheme: light; }
```

**Anti-flash** en `index.html`, antes del bundle:

```html
<script>
  (function(){
    try {
      var t = localStorage.getItem('wf_theme');
      document.documentElement.setAttribute('data-theme',
        (t === 'light' || t === 'dark') ? t : 'dark');
    } catch(e) { document.documentElement.setAttribute('data-theme','dark'); }
  })();
</script>
```

---

## Screens / Views

### 1. Dashboard

**Layout:** Grid 3 columnas de KPIs arriba, luego 2 columnas (proyectos activos 2fr | tareas de la semana 1fr).

**KPI Cards** (3 up): cada una con label secundario, valor grande (font-size 2xl, weight 600), delta vs semana anterior en color success/danger, y sparkline SVG (60×24, stroke `--color-accent`, strokeWidth 1.5).
- Pomodoros hoy: valor absoluto + delta
- Tareas completadas esta semana: valor + delta
- Horas enfocadas: valor con decimal + delta

**Active Projects Card:** lista de proyectos con `status === 'Active'`. Por fila:
- Nombre (weight 500) + status pill a la derecha
- Descripción truncada 1 línea, `--color-text-secondary`
- Barra de progreso (4px alto, `--color-border` track, `--color-accent` fill)
- Meta: `doneCount/taskCount tareas · due <fecha>`

**Week Tasks Card:** tareas con dueDate en los próximos 7 días, agrupadas por día. Item clickable que abre `TaskDetailPanel`.

### 2. Proyectos

**Layout:** Grid `repeat(auto-fill, minmax(320px, 1fr))`, gap 20px.

**Project Card:**
- Header: nombre + status pill (Active/On Hold/Completed/Archived con colores variados — ver `styles.css`)
- Descripción 2 líneas max con `-webkit-line-clamp: 2`
- Tags: pills pequeñas (`--color-bg-tertiary`, 11px)
- Footer: avatars stack (miembros, overlap -6px), fecha end, progreso % + barra

### 3. Tareas

**Layout:** Filtros arriba (pills por status + dropdown proyecto), lista abajo.

**Task Item:** fila con:
- Checkbox redondo (20px, border `--color-border`, check si Done)
- Status pill + título + priority dot
- Meta derecha: `proyecto · due <fecha> · <pomodoros>/<est> 🍅`
- Hover: `--color-bg-secondary`
- Selected: `rgba(88,166,255,0.1)` + border-left accent

### 4. Task Detail Panel (lateral derecho, 400px)

Se abre sobre el contenido. Sections:

- **Header:** título tarea + close button
- **Meta grid:** proyecto, estado, prioridad, due date, tags
- **Pomodoro Timer:** ring SVG 200×200, stroke dashoffset animado; botones Start / Pause / Stop; duración configurable (25 min focus / 5 min short / 15 min long)
  - Estados: `idle` → `running` → `paused` → `idle`
  - Al completar un ciclo: incrementar `completedPomodoros`, mostrar toast, auto-start break
- **Comentarios:** lista de comments + textarea + botón submit

### 5. Reportes

**Layout:** Grid 2×2 de cards.

- **Distribución trabajo/descanso:** donut SVG (focus vs break ratio de últimos 7 días)
- **Barras 14 días:** cada barra = pomodoros de un día, stroke `--color-accent`
- **Heatmap** 7×7: activity cells con intensity levels l0-l4 (ver CSS activity-cell)
- **Sesiones recientes:** tabla con columnas: Fecha, Tarea, Duración, Tipo, Estatus

### 6. Configuración

Form con secciones:
- **Pomodoro:** inputs de duración focus/short/long, toggle auto-start breaks, toggle auto-start pomodoros
- **Notificaciones:** toggles de desktop/sound/email
- **Apariencia:** el toggle de tema vive en la TopBar, pero aquí puede haber un radio group redundante (dark/light/system)
- **Datos:** botones de export/import JSON

---

## Interactions & Behavior

- **Navegación sidebar:** click cambia `view`, persiste en localStorage `wf_view`.
- **Task select:** click en cualquier task item → abre `TaskDetailPanel`. Escape o botón X cierra.
- **Theme toggle:** botón sun/moon en TopBar → alterna `'dark' | 'light'`, persiste `wf_theme`, setea `html[data-theme]`.
- **Pomodoro start:** arranca `setInterval(1000)` que decrementa segundos restantes y actualiza el stroke-dashoffset del ring. `pause` conserva el tiempo; `stop` resetea.
- **Comment submit:** cmd/ctrl+Enter envía; input se limpia; timestamp = now.
- **Filtros de tareas:** filtrado en memoria, no hay fetch extra.

## Animaciones

- **Panel detalle:** slide-in desde la derecha, 200ms `ease-out`, `translateX(100%) → 0`.
- **Pomodoro ring:** stroke-dashoffset transition lineal por tick del setInterval (no CSS transition, es JS-driven).
- **Theme switch:** cambio instantáneo (o si quieres, `transition: background-color 180ms ease` en body — opcional; puede causar flash en elementos anidados).
- **Hover en cards:** `transform: translateY(-1px)`, `box-shadow` sutil.

---

## Assets / Icons

Todos los íconos son SVG inline en `components/Icons.jsx`. Viewbox 24×24, stroke `currentColor`, strokeWidth 1.8, round caps. Librería:

`dashboard, folder, check, chart, gear, search, filter, bell, plus, clock, play, pause, stop, sun, moon, x (close), chevron-down, tag, user, calendar`

Si el repo ya usa Lucide / Feather / Heroicons, **sustituye por la librería existente** para consistencia. Los nombres coinciden con Lucide.

---

## State Management

El prototipo usa `useState` local en `<App />` + `useEffect` para localStorage. Si el repo ya tiene:
- **Context API** → crea `ThemeContext` + `AppShellContext` (view + selectedTask).
- **Zustand / Redux** → añade slices `themeSlice`, `uiSlice`.
- **TanStack Query / SWR** → los datos `projects/tasks/sessions` van a queries; el UI state local queda separado.

Sigue el patrón ya establecido en `src/` — no introduzcas una librería nueva solo para esto.

---

## Checklist de implementación

- [ ] Reestructurar `src/styles/theme.css` con split dark/light
- [ ] Añadir anti-flash script en `index.html`
- [ ] Crear `src/context/ThemeContext.tsx` (o integrar al store existente)
- [ ] `ThemeToggle` en TopBar
- [ ] `Sidebar` con items + badge count + footer user
- [ ] `TopBar` con search + icon buttons + botón nuevo + avatar
- [ ] `Dashboard` con 3 KPIs + proyectos activos + tareas semana
- [ ] `Projects` grid de cards
- [ ] `Tasks` lista con filtros
- [ ] `TaskDetailPanel` con Pomodoro funcional
- [ ] `Reports` con donut + barras + heatmap + tabla
- [ ] `Settings` form
- [ ] Overrides `[data-theme="light"]` para status pills, progress track, activity cells, scrollbar
- [ ] Reemplazar SVGs inline por librería de íconos del repo (si existe)
- [ ] Conectar entidades reales (supabase / API) en lugar del seed data
- [ ] Smoke test: navegación funciona, selección de tarea abre panel, pomodoro cuenta correctamente, toggle tema persiste tras reload

## Files en este bundle

```
design_handoff_workflow/
├── README.md                     ← este archivo
├── WorkFlow Visualizacion.html   ← root de referencia
├── styles.css                    ← tokens + layouts + overrides
├── data.js                       ← seed data (shape de entidades)
└── components/
    ├── Icons.jsx                 ← librería SVG
    ├── Shell.jsx                 ← Sidebar + TopBar + ThemeToggle
    ├── Dashboard.jsx
    ├── Projects.jsx
    ├── Tasks.jsx
    ├── TaskDetail.jsx            ← Pomodoro
    └── Reports.jsx
```

Abre `WorkFlow Visualizacion.html` en un navegador para ver el diseño funcionando — todo el comportamiento descrito arriba está ahí como referencia viva.

## Notas finales

- El prototipo usa React vía Babel in-browser. No es el stack del repo; úsalo solo como referencia visual y de comportamiento.
- Los nombres de clases CSS (`.kpi-card`, `.status-to-do`, `.project-status.active`, etc.) son una propuesta — ajústalos a la convención del repo.
- Si el repo ya tiene componentes parciales para Dashboard/Projects/Tasks, **integra los cambios visuales en ellos** en lugar de reemplazarlos.
- El Pomodoro del prototipo no persiste el estado entre reloads — en el repo real, considera guardar `{ taskId, remainingSeconds, state, startedAt }` para sobrevivir refreshes.
- El toggle de tema respeta `prefers-color-scheme` solo si localStorage está vacío; puedes extenderlo para seguir el sistema dinámicamente con `matchMedia` listener.
