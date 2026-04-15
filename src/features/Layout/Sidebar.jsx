import './Sidebar.css';

/**
 * Sidebar component - Main navigation for the application
 * Provides links to different app sections (Dashboard, Projects, Tasks, etc.)
 */
export function Sidebar({ onNavigate, currentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'tasks', label: 'Tasks' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">WorkFlow</h1>
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

      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0</p>
      </div>
    </nav>
  );
}
