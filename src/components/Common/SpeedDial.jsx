import { useEffect, useRef, useState } from 'react';
import './SpeedDial.css';

export function SpeedDial({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="speed-dial" ref={ref}>
      {open && (
        <div className="speed-dial-actions">
          {actions.map((action) => (
            <button
              key={action.label}
              className="speed-dial-item"
              onClick={() => { setOpen(false); action.onClick(); }}
            >
              <span className="speed-dial-label">{action.label}</span>
              <span className="speed-dial-icon">{action.icon}</span>
            </button>
          ))}
        </div>
      )}
      <button
        className={`speed-dial-trigger${open ? ' speed-dial-trigger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Crear nuevo"
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
}
