const { useState, useEffect, useRef, useMemo } = React;

function statusClass(s='') { return 'status-' + s.toLowerCase().replaceAll(' ','-'); }

function StatusPill({ status }) {
  return <span className={`task-status ${statusClass(status)}`}>{status}</span>;
}

// ── Dashboard ──────────────────────────────────────────
function Sparkline({ values, color = '#58a6ff' }) {
  const w = 120, hgt = 24;
  const max = Math.max(...values, 1);
  const pts = values.map((v,i)=>[ (i/(values.length-1))*w, hgt - (v/max)*hgt ]);
  const d = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  return (
    <svg className="kpi-sparkline" viewBox={`0 0 ${w} ${hgt}`} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5"/>
      <path d={d + ` L ${w} ${hgt} L 0 ${hgt} Z`} fill={color} fillOpacity="0.12"/>
    </svg>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <span className={`project-status ${project.status.toLowerCase().replaceAll(' ','-')}`}>{project.status}</span>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-progress">
        <div className="progress-track">
          <div className={`progress-fill ${project.progress >= 80 ? 'success' : project.progress < 40 ? 'warning' : ''}`}
               style={{ width: project.progress + '%' }} />
        </div>
        <div className="progress-meta">
          <span>{project.doneCount}/{project.taskCount} tareas</span>
          <span>{project.progress}%</span>
        </div>
      </div>
      <div className="project-meta-row">
        <span className="meta-chip"><window.Icon name="calendar" size={11}/> {window.formatDate(project.endDate)}</span>
        <span className="meta-chip"><window.Icon name="users" size={11}/> {project.members.length}</span>
      </div>
    </div>
  );
}

function Dashboard({ projects, tasks, sessions, onTaskSelect, selectedTaskId }) {
  const Icon = window.Icon;
  const active = projects.filter(p => p.status === 'Active');
  const todayStr = window.formatDate(window.TODAY_DATE.toISOString());

  const workSessions = sessions.filter(s=>s.type==='Work');
  const totalWorkMin = workSessions.reduce((a,s)=>a+s.duration,0);
  const todayWork = workSessions.filter(s => new Date(s.startTime).toDateString() === window.TODAY_DATE.toDateString());
  const todayMin = todayWork.reduce((a,s)=>a+s.duration,0);

  // last 14 days counts for sparkline
  const last14 = Array.from({length:14}).map((_,i)=>{
    const d = new Date(window.TODAY_DATE); d.setDate(d.getDate() - (13-i));
    const ds = d.toDateString();
    return workSessions.filter(s=>new Date(s.startTime).toDateString()===ds).length;
  });

  const groupTasksByDate = (list) => {
    const today = new Date(window.TODAY_DATE); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const weekEnd = new Date(today); weekEnd.setDate(today.getDate()+7);
    const g = { today: [], tomorrow: [], upcoming: [] };
    list.filter(t=>t.status !== 'Done' && t.endDate).forEach(t=>{
      const due = new Date(t.endDate + 'T00:00:00');
      if (due.getTime() === today.getTime()) g.today.push(t);
      else if (due.getTime() === tomorrow.getTime()) g.tomorrow.push(t);
      else if (due > today && due <= weekEnd) g.upcoming.push(t);
    });
    return g;
  };

  const g = groupTasksByDate(tasks);

  const renderGroup = (label, arr) => !arr.length ? null : (
    <div className="task-date-group" key={label}>
      <div className="task-date-label">{label}</div>
      {arr.map(t => (
        <div key={t.id}
             className={`weekly-task-item ${selectedTaskId===t.id?'selected':''}`}
             onClick={()=>onTaskSelect(t)}>
          <div className="weekly-task-top">
            <div className="weekly-task-name">{t.name}</div>
            <StatusPill status={t.status}/>
          </div>
          <div className="weekly-task-meta">
            <span>{t.projectName}</span>
            {t.pomodoroCount>0 && <><span className="dot"/><span>🍅 {t.pomodoroCount}</span></>}
            {t.commentCount>0 && <><span className="dot"/><span>💬 {t.commentCount}</span></>}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="page" data-screen-label="01 Dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Buen día, Cesar. Hoy es {window.TODAY_DATE.toLocaleDateString('es-MX',{weekday:'long', day:'numeric', month:'long'})}.</p>
      </div>

      <div className="dashboard-kpis">
        <div className="kpi-card">
          <div className="kpi-label">Proyectos activos</div>
          <div className="kpi-row">
            <div className="kpi-value">{active.length}</div>
            <span className="kpi-unit">de {projects.length}</span>
            <span className="kpi-delta up">+1</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tareas abiertas</div>
          <div className="kpi-row">
            <div className="kpi-value">{tasks.filter(t=>t.status!=='Done').length}</div>
            <span className="kpi-unit">tareas</span>
            <span className="kpi-delta down">−2</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pomodoros hoy</div>
          <div className="kpi-row">
            <div className="kpi-value">{todayWork.length}</div>
            <span className="kpi-unit">· {todayMin} min</span>
          </div>
          <Sparkline values={last14}/>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tiempo enfocado (14d)</div>
          <div className="kpi-row">
            <div className="kpi-value">{(totalWorkMin/60).toFixed(1)}</div>
            <span className="kpi-unit">horas</span>
          </div>
          <Sparkline values={last14.map(n=>n*25)} color="#238636"/>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Proyectos activos</h2>
            <button className="btn btn-secondary"><Icon name="plus" size={12}/> Nuevo proyecto</button>
          </div>
          <div className="project-grid">
            {active.slice(0,4).map(p => <ProjectCard key={p.id} project={p}/>)}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Esta semana</h2>
            <span className="section-meta">{(g.today.length+g.tomorrow.length+g.upcoming.length)} pendientes</span>
          </div>
          <div className="weekly-tasks">
            {renderGroup('HOY · ' + todayStr, g.today)}
            {renderGroup('MAÑANA', g.tomorrow)}
            {renderGroup('PRÓXIMOS DÍAS', g.upcoming)}
            {(!g.today.length && !g.tomorrow.length && !g.upcoming.length) && (
              <p className="empty-state">No hay tareas para esta semana.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

window.Dashboard = Dashboard;
window.StatusPill = StatusPill;
window.statusClass = statusClass;
