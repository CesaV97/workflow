import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const ICONS = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  tasks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  reports: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',      icon: 'dashboard' },
  { id: 'projects',  label: 'Proyectos',      icon: 'projects'  },
  { id: 'tasks',     label: 'Tareas',         icon: 'tasks'     },
  { id: 'reports',   label: 'Reportes',       icon: 'reports'   },
  { id: 'settings',  label: 'Configuración',  icon: 'settings'  },
];

function getInitials(email = '') {
  const parts = email.split('@')[0].split(/[._-]/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : email.slice(0, 2).toUpperCase();
}

function CollapseIcon({ collapsed }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ transition: 'transform 200ms', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

export function Sidebar({ onNavigate, currentView }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const initials = getInitials(user?.email ?? '');

  return (
    <nav className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <span className="sidebar-logo-mark">⚡</span>
            Task Flow
          </div>
        )}
        {collapsed && <span className="sidebar-logo-mark">⚡</span>}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      {!collapsed && <div className="sidebar-section-label">Workspace</div>}

      <ul className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <span className="nav-icon">{ICONS[item.icon]}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="user-avatar">{initials}</div>
        {!collapsed && (
          <div className="user-meta">
            <div className="user-email">{user?.email ?? ''}</div>
            <div className="user-plan">Personal</div>
          </div>
        )}
      </div>
    </nav>
  );
}
