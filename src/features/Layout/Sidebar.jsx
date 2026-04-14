import './Sidebar.css';

/**
 * Sidebar component - Main navigation for the application
 * Provides links to different app sections (Dashboard, Projects, Tasks, etc.)
 */
export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">WorkFlow</h1>
      </div>

      <ul className="sidebar-nav">
        <li>
          <a href="#dashboard" className="nav-link">Dashboard</a>
        </li>
        <li>
          <a href="#projects" className="nav-link">Projects</a>
        </li>
        <li>
          <a href="#tasks" className="nav-link">Tasks</a>
        </li>
        <li>
          <a href="#pomodoro" className="nav-link">Pomodoro</a>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0</p>
      </div>
    </nav>
  );
}
