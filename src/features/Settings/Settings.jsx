import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

function Toggle({ on, onChange }) {
  return (
    <div
      className={`toggle ${on ? 'on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onChange(!on) : null}
    />
  );
}

export function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(false);
  const [autoBreak, setAutoBreak] = useState(true);

  const prefRows = [
    { label: 'Notificaciones', desc: 'Avisar cuando termine un Pomodoro', state: notif, set: setNotif },
    { label: 'Sonido al finalizar', desc: 'Reproducir campanazo al cerrar sesión', state: sound, set: setSound },
    { label: 'Auto-iniciar descanso', desc: 'Al completar Work, iniciar Rest automáticamente', state: autoBreak, set: setAutoBreak },
    { label: 'Dark mode', desc: 'Tema oscuro tipo GitHub', state: theme === 'dark', set: () => toggleTheme() },
  ];

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Preferencias personales y Pomodoro</p>
      </div>

      <div className="settings-section-label">Cuenta</div>
      <div className="settings-list" style={{ marginBottom: 28 }}>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Sesión activa</div>
            <div className="settings-row-desc">{user?.email ?? 'Sin usuario autenticado'}</div>
          </div>
        </div>
      </div>

      <div className="settings-section-label">Preferencias</div>
      <div className="settings-list" style={{ marginBottom: 28 }}>
        {prefRows.map((r, i) => (
          <div key={i} className="settings-row">
            <div>
              <div className="settings-row-label">{r.label}</div>
              <div className="settings-row-desc">{r.desc}</div>
            </div>
            <Toggle on={r.state} onChange={r.set} />
          </div>
        ))}
      </div>

      <div className="settings-section-label">Duraciones Pomodoro</div>
      <div className="settings-list">
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Work</div>
            <div className="settings-row-desc">Duración de la sesión de trabajo</div>
          </div>
          <span className="settings-badge" style={{ background: 'var(--color-success)' }}>25 min</span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Rest</div>
            <div className="settings-row-desc">Duración del descanso corto</div>
          </div>
          <span className="settings-badge" style={{ background: 'var(--color-warning)' }}>5 min</span>
        </div>
      </div>
    </main>
  );
}
