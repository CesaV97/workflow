import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import { useTasksContext } from '../../context/TasksContext';
import { POMODORO_TYPES } from '../../constants/pomodoroConfig';
import './Reports.css';

export function Reports() {
  const { sessions, loading, error } = usePomodoroSessions();
  const { tasks } = useTasksContext();

  const workSessions = sessions.filter(s => s.type === POMODORO_TYPES.WORK);
  const restSessions = sessions.filter(s => s.type === POMODORO_TYPES.REST);
  const totalWork = workSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalRest = restSessions.reduce((acc, s) => acc + s.duration, 0);
  const total = totalWork + totalRest;
  const workPct = total > 0 ? Math.round((totalWork / total) * 100) : 0;
  const restPct = total > 0 ? 100 - workPct : 0;

  // 14-day histogram
  const today = new Date();
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return d;
  });
  const maxMin = Math.max(1, ...days.map(d =>
    sessions.filter(s => new Date(s.startTime).toDateString() === d.toDateString())
      .reduce((a, s) => a + s.duration, 0)
  ));

  // Activity heatmap (140 cells)
  const heat = Array.from({ length: 140 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (139 - i));
    const count = sessions.filter(s =>
      s.type === POMODORO_TYPES.WORK &&
      new Date(s.startTime).toDateString() === d.toDateString()
    ).length;
    return Math.min(4, count);
  });

  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t.name]));
  const recent = [...sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).slice(0, 8);

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">Últimos 14 días · {sessions.length} sesiones registradas</p>
      </div>

      {error && <p className="empty-state">{error}</p>}

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
          <span className="summary-value">{(totalWork / 60).toFixed(1)} hrs</span>
          <span className="summary-label">Promedio: {(totalWork / 14).toFixed(0)} min/día</span>
        </div>
      </div>

      {!loading && total > 0 && (
        <section className="dashboard-section" style={{ marginBottom: 16 }}>
          <div className="section-header">
            <h2 className="section-title">Distribución trabajo / descanso</h2>
          </div>
          <div className="distribution-bar-container">
            <div className="distribution-bar--work" style={{ width: `${workPct}%` }} />
            <div className="distribution-bar--rest" style={{ width: `${restPct}%` }} />
          </div>
          <div className="distribution-legend">
            <span className="legend-item legend-item--work">Trabajo {workPct}%</span>
            <span className="legend-item legend-item--rest">Descanso {restPct}%</span>
          </div>

          <div className="chart-bars" style={{ marginTop: 20 }}>
            {days.map((d, i) => {
              const w = sessions.filter(s => s.type === POMODORO_TYPES.WORK && new Date(s.startTime).toDateString() === d.toDateString()).reduce((a, s) => a + s.duration, 0);
              const r = sessions.filter(s => s.type === POMODORO_TYPES.REST && new Date(s.startTime).toDateString() === d.toDateString()).reduce((a, s) => a + s.duration, 0);
              return (
                <div key={i} className="chart-bar-col">
                  <div className="chart-bar-stack">
                    {r > 0 && <div className="chart-bar rest" style={{ height: `${(r / maxMin) * 80}%` }} />}
                    {w > 0 && <div className="chart-bar work" style={{ height: `${(w / maxMin) * 100}%` }} />}
                  </div>
                  <div className="chart-bar-label">{d.getDate()}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="dashboard-section" style={{ marginBottom: 16 }}>
        <div className="section-header">
          <h2 className="section-title">Actividad últimas 20 semanas</h2>
          <span className="section-meta">Menos → Más</span>
        </div>
        <div className="activity-heatmap">
          {heat.map((lvl, i) => (
            <div key={i} className={`activity-cell${lvl > 0 ? ` l${lvl}` : ''}`} />
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Historial de sesiones</h2>
          <span className="section-meta">Recientes</span>
        </div>
        {loading ? (
          <p className="empty-state">Cargando sesiones...</p>
        ) : recent.length === 0 ? (
          <p className="empty-state">No hay sesiones registradas aún. Usa el timer Pomodoro para comenzar.</p>
        ) : (
          <ul className="session-history-list">
            {recent.map(s => (
              <li key={s.id} className="session-history-item">
                <span className={`session-type-badge session-type-badge--${s.type.toLowerCase()}`}>
                  {s.type === POMODORO_TYPES.WORK ? 'TRABAJO' : 'DESCANSO'}
                </span>
                <span className="session-task">{taskMap[s.taskId] || 'Tarea eliminada'}</span>
                <span className="session-time">
                  {new Date(s.startTime).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })},
                  {' '}{new Date(s.startTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="session-duration">{s.duration} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
