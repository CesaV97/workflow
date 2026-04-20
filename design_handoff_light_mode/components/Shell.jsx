function Sidebar({ currentView, onNavigate, taskCount }) {
  const Icon = window.Icon;
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'projects',  label: 'Proyectos', icon: 'folder' },
    { id: 'tasks',     label: 'Tareas',    icon: 'check', badge: taskCount },
    { id: 'reports',   label: 'Reportes',  icon: 'chart' },
    { id: 'settings',  label: 'Configuración', icon: 'gear' },
  ];
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">⚡</span>
          WorkFlow
        </div>
      </div>
      <div className="sidebar-section-label">Workspace</div>
      <ul className="sidebar-nav">
        {items.map(item => (
          <li key={item.id}>
            <button
              className={`nav-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} size={14} className="nav-icon" />
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="count-badge" style={{marginLeft: 'auto'}}>{item.badge}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <div className="user-avatar">CV</div>
        <div className="user-meta">
          <div className="user-email">cesar@workflow.app</div>
          <div className="user-plan">Personal</div>
        </div>
      </div>
    </nav>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      className="icon-btn theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}>
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function TopBar({ onNew, theme, onToggleTheme }) {
  const Icon = window.Icon;
  return (
    <header className="topbar" data-screen-label="topbar">
      <div className="topbar-search">
        <Icon name="search" size={14} />
        <input className="search-input" placeholder="Buscar proyectos o tareas..." />
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Filtros"><Icon name="filter" size={16}/></button>
        <button className="icon-btn" aria-label="Notificaciones"><Icon name="bell" size={16}/></button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme}/>
        <button className="btn-nuevo" onClick={onNew}>
          <Icon name="plus" size={14} />
          <span>Nueva tarea</span>
        </button>
        <div className="topbar-user">
          <div className="user-avatar" style={{width:28,height:28}}>CV</div>
        </div>
      </div>
    </header>
  );
}

window.Sidebar = Sidebar;
window.TopBar = TopBar;
