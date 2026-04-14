import './TopBar.css';

/**
 * TopBar component - Header bar for the main content area
 * Displays the current section title and user action buttons
 *
 * @param {string} title - Title to display (e.g., "Dashboard", "Projects")
 * @param {React.ReactNode} actions - Optional action buttons/controls
 */
export function TopBar({ title, actions = null }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-actions" role="region" aria-label="topbar actions">
        {actions}
      </div>
    </header>
  );
}
