function Reports({ sessions, tasks }) {
  const Icon = window.Icon;
  const workSessions = sessions.filter(s => s.type === 'Work');
  const restSessions = sessions.filter(s => s.type === 'Rest');
  const totalWork = workSessions.reduce((a,s)=>a+s.duration, 0);
  const totalRest = restSessions.reduce((a,s)=>a+s.duration, 0);
  const total = totalWork + totalRest;
  const workPct = total > 0 ? Math.round((totalWork/total)*100) : 0;
  const restPct = total > 0 ? 100 - workPct : 0;

  // Days histogram (14 d)
  const days = Array.from({length:14}).map((_,i)=>{
    const d = new Date(window.TODAY_DATE); d.setDate(d.getDate()-(13-i));
    return d;
  });
  const maxMin = Math.max(1, ...days.map(d => sessions.filter(s=>new Date(s.startTime).toDateString()===d.toDateString()).reduce((a,s)=>a+s.duration,0)));

  // Heatmap cells (last 20x7=140 days simulated with sessions spread)
  const heat = Array.from({length:140}).map((_,i)=> {
    const intensity = (workSessions.filter(s => (new Date(s.startTime).getDate() + i*7) % 13 < 5)).length;
    const level = Math.min(4, Math.floor((i*3 + intensity)%6));
    return level;
  });

  // session-to-task name map
  const taskMap = Object.fromEntries(tasks.map(t=>[t.id, t.name]));
  const recent = [...sessions].sort((a,b)=>new Date(b.startTime)-new Date(a.startTime)).slice(0, 8);

  return (
    <main className="page" data-screen-label="05 Reportes">
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">Últimos 14 días · {sessions.length} sesiones registradas</p>
      </div>

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
          <span className="summary-value">{(totalWork/60).toFixed(1)} hrs</span>
          <span className="summary-label">Promedio: {(totalWork/14).toFixed(0)} min/día</span>
        </div>
      </div>

      <section className="dashboard-section" style={{marginBottom:16}}>
        <div className="section-header">
          <h2 className="section-title">Distribución trabajo / descanso</h2>
        </div>
        <div className="distribution-bar-container">
          <div className="distribution-bar--work" style={{width: workPct+'%'}}/>
          <div className="distribution-bar--rest" style={{width: restPct+'%'}}/>
        </div>
        <div className="distribution-legend">
          <span className="legend-item legend-item--work">Trabajo {workPct}%</span>
          <span className="legend-item legend-item--rest">Descanso {restPct}%</span>
        </div>

        <div className="chart-bars" style={{marginTop: 20}}>
          {days.map((d,i) => {
            const w = sessions.filter(s=>s.type==='Work' && new Date(s.startTime).toDateString()===d.toDateString()).reduce((a,s)=>a+s.duration,0);
            const r = sessions.filter(s=>s.type==='Rest' && new Date(s.startTime).toDateString()===d.toDateString()).reduce((a,s)=>a+s.duration,0);
            return (
              <div key={i} className="chart-bar-col">
                <div className="chart-bar-stack">
                  {r>0 && <div className="chart-bar rest" style={{height: (r/maxMin)*80 + '%'}}/>}
                  {w>0 && <div className="chart-bar work" style={{height: (w/maxMin)*100 + '%'}}/>}
                </div>
                <div className="chart-bar-label">{d.getDate()}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section" style={{marginBottom:16}}>
        <div className="section-header">
          <h2 className="section-title">Actividad últimas 20 semanas</h2>
          <span className="section-meta">Menos → Más</span>
        </div>
        <div className="activity-heatmap">
          {heat.map((lvl,i) => <div key={i} className={`activity-cell ${lvl>0?'l'+lvl:''}`}/>)}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Historial de sesiones</h2>
          <span className="section-meta">Recientes</span>
        </div>
        <ul className="session-history-list">
          {recent.map(s => (
            <li key={s.id} className="session-history-item">
              <span className={`session-type-badge session-type-badge--${s.type.toLowerCase()}`}>
                {s.type === 'Work' ? 'TRABAJO' : 'DESCANSO'}
              </span>
              <span className="session-task">{taskMap[s.taskId] || 'Tarea eliminada'}</span>
              <span className="session-time">
                {new Date(s.startTime).toLocaleDateString('es-MX',{month:'short',day:'numeric'})}, {new Date(s.startTime).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}
              </span>
              <span className="session-duration">{s.duration} min</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Settings() {
  const [notif, setNotif] = React.useState(true);
  const [sound, setSound] = React.useState(false);
  const [autoBreak, setAutoBreak] = React.useState(true);
  const [dark, setDark] = React.useState(true);

  const rows = [
    { label: 'Notificaciones', desc: 'Avisar cuando termine un Pomodoro', state: notif, set: setNotif },
    { label: 'Sonido al finalizar', desc: 'Reproducir un campanazo al cerrar una sesión', state: sound, set: setSound },
    { label: 'Auto-iniciar descanso', desc: 'Al completar Work, iniciar Rest automáticamente', state: autoBreak, set: setAutoBreak },
    { label: 'Dark mode', desc: 'Tema oscuro tipo GitHub', state: dark, set: setDark },
  ];

  return (
    <main className="page" data-screen-label="06 Configuración">
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Preferencias personales y Pomodoro</p>
      </div>

      <h2 className="section-title" style={{marginBottom:12, fontSize:13, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:0.6}}>Preferencias</h2>
      <div className="settings-list">
        {rows.map((r,i) => (
          <div key={i} className="settings-row">
            <div>
              <div className="settings-row-label">{r.label}</div>
              <div className="settings-row-desc">{r.desc}</div>
            </div>
            <div className={`toggle ${r.state?'on':''}`} onClick={()=>r.set(!r.state)}/>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{marginTop:28, marginBottom:12, fontSize:13, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:0.6}}>Duraciones Pomodoro</h2>
      <div className="settings-list">
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Work</div>
            <div className="settings-row-desc">Duración por defecto de la sesión de trabajo</div>
          </div>
          <span className="task-detail-status" style={{background:'var(--color-success)'}}>25 min</span>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Rest</div>
            <div className="settings-row-desc">Duración por defecto del descanso corto</div>
          </div>
          <span className="task-detail-status" style={{background:'var(--color-warning)'}}>5 min</span>
        </div>
      </div>
    </main>
  );
}

window.Reports = Reports;
window.Settings = Settings;
