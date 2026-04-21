import { useTheme } from '../../context/ThemeContext';
import { usePomodoro } from '../../context/PomodoroContext';
import './TopBar.css';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      className="icon-btn theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function MiniTimer() {
  const { isActive, mm, ss, sessionType, handlePause, handleStop } = usePomodoro();
  if (!isActive) return null;

  return (
    <div className={`topbar-mini-timer${sessionType === 'Rest' ? ' topbar-mini-timer--rest' : ''}`}>
      <span className="mini-timer-dot" aria-hidden="true" />
      <span className="mini-timer-time">{mm}:{ss}</span>
      <span className="mini-timer-type">{sessionType}</span>
      <button className="mini-timer-btn" onClick={handlePause} aria-label="Pausar temporizador">⏸</button>
      <button className="mini-timer-btn" onClick={handleStop}  aria-label="Detener temporizador">⏹</button>
    </div>
  );
}

export function TopBar({ userEmail, onSignOut, onNavigate, onMenuToggle }) {
  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuToggle} aria-label="Menú">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div className="topbar-search">
        <span className="search-icon"><SearchIcon /></span>
        <input
          className="search-input"
          type="search"
          placeholder="Buscar proyectos o tareas..."
          aria-label="Buscar proyectos o tareas"
          disabled
        />
        <span className="kbd">⌘K</span>
      </div>
      <MiniTimer />
      <div className="topbar-actions">
        <ThemeToggle />
        <button className="btn-nuevo" aria-label="Nueva tarea" onClick={() => onNavigate?.('tasks')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva tarea
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
