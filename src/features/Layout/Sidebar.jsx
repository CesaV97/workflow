import './Sidebar.css';

export function Sidebar({ onNavigate, currentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'tasks', label: 'Tareas' },
    { id: 'reports', label: 'Reportes' },
    { id: 'settings', label: 'Configuración' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">⚡ WorkFlow</div>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
