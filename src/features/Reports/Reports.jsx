import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import { POMODORO_TYPES } from '../../constants/pomodoroConfig';
import './Reports.css';

/**
 * Reports page — shows Work vs Rest session summary and history.
 */
export function Reports() {
  const { sessions } = usePomodoroSessions();

  const workSessions = sessions.filter(s => s.type === POMODORO_TYPES.WORK);
  const restSessions = sessions.filter(s => s.type === POMODORO_TYPES.REST);
  const totalWork = workSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalRest = restSessions.reduce((acc, s) => acc + s.duration, 0);
  const total = totalWork + totalRest;
  const workPct = total > 0 ? Math.round((totalWork / total) * 100) : 0;
  const restPct = total > 0 ? 100 - workPct : 0;

  return (
    <main className="reports">
      <h1 className="reports-title">Reportes</h1>

      <div className="reports-summary">
        <div className="summary-card">
          <span className="summary-value">{workSessions.length}</span>
          <span className="summary-label">Sesiones de trabajo</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{restSessions.length}</span>
          <span className="summary-label">Sesiones de descanso</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{totalWork} min</span>
          <span className="summary-label">Tiempo trabajado</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{totalRest} min</span>
          <span className="summary-label">Tiempo descansado</span>
        </div>
      </div>

      {total > 0 && (
        <div className="reports-distribution">
          <h2 className="section-title">Distribución Trabajo / Descanso</h2>
          <div className="distribution-bar-container">
            <div
              className="distribution-bar distribution-bar--work"
              style={{ width: `${workPct}%` }}
              title={`Trabajo: ${workPct}%`}
            />
            <div
              className="distribution-bar distribution-bar--rest"
              style={{ width: `${restPct}%` }}
              title={`Descanso: ${restPct}%`}
            />
          </div>
          <div className="distribution-legend">
            <span className="legend-item legend-item--work">⬛ Trabajo {workPct}%</span>
            <span className="legend-item legend-item--rest">⬛ Descanso {restPct}%</span>
          </div>
        </div>
      )}

      <div className="reports-history">
        <h2 className="section-title">Historial de Sesiones</h2>
        {sessions.length === 0 ? (
          <p className="empty-state">No hay sesiones registradas aún. Usa el timer Pomodoro para comenzar.</p>
        ) : (
          <ul className="session-history-list">
            {[...sessions].reverse().map(session => (
              <li key={session.id} className="session-history-item">
                <span className={`session-type-badge session-type-badge--${session.type.toLowerCase()}`}>
                  {session.type === POMODORO_TYPES.WORK ? 'TRABAJO' : 'DESCANSO'}
                </span>
                <span className="session-time">
                  {new Date(session.startTime).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })},
                  {' '}{new Date(session.startTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="session-duration">{session.duration} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
