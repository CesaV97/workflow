import { usePomodoro } from '../../context/PomodoroContext';
import './Toast.css';

export function ToastContainer() {
  const { toasts, dismissToast } = usePomodoro();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notificaciones" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon" aria-hidden="true">{t.type === 'success' ? '✓' : 'ℹ'}</span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => dismissToast(t.id)} aria-label="Cerrar notificación">×</button>
        </div>
      ))}
    </div>
  );
}
