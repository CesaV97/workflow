import './Sidebar.css';

/**
 * Sidebar component - Main navigation for the application
 * Fixed left sidebar with logo and navigation to all app sections.
 *
 * @param {function} onNavigate - Called with the view id when a nav item is clicked
 * @param {string} currentView - The currently active view id
 */
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
