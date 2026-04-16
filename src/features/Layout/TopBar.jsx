import './TopBar.css';

export function TopBar({ userEmail, onSignOut, onNavigate }) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar proyectos o tareas..."
          aria-label="Buscar proyectos o tareas"
          disabled
        />
      </div>
      <div className="topbar-actions">
        <button className="btn-nuevo" aria-label="Nueva tarea" onClick={() => onNavigate?.('tasks')}>
          + Nueva tarea
        </button>
        <div className="topbar-user">
          <span className="topbar-user-email">{userEmail}</span>
          <button className="topbar-profile" aria-label="Cerrar sesión" onClick={onSignOut}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
