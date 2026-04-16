import './TopBar.css';

/**
 * TopBar component - Top navigation bar with search and actions.
 *
 * @param {string} title - Current page title (unused visually, kept for context)
 */
export function TopBar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar proyectos o tareas..."
          aria-label="Buscar proyectos o tareas"
        />
      </div>
      <div className="topbar-actions">
        <button className="btn-nuevo" aria-label="Nuevo">+ Nuevo</button>
        <button className="topbar-profile" aria-label="Perfil">⚙️ Perfil</button>
      </div>
    </header>
  );
}
