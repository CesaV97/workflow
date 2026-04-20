function Projects({ projects, onProjectClick }) {
  const Icon = window.Icon;
  return (
    <main className="page" data-screen-label="02 Proyectos">
      <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <div>
          <h1 className="page-title">Proyectos</h1>
          <p className="page-subtitle">{projects.length} proyectos · {projects.filter(p=>p.status==='Active').length} activos</p>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Nuevo proyecto</button>
      </div>

      <div className="tasks-toolbar">
        <span style={{color:'var(--color-text-secondary)', fontSize:12, marginRight:4}}>Estatus:</span>
        <button className="filter-chip active">Todos</button>
        <button className="filter-chip">Active</button>
        <button className="filter-chip">On Hold</button>
        <button className="filter-chip">Completed</button>
        <button className="filter-chip">Archived</button>
        <div style={{flex:1}}/>
        <button className="btn btn-ghost"><Icon name="filter" size={12}/> Ordenar</button>
      </div>

      <div className="projects-grid">
        {projects.map(p => (
          <div className="project-card-lg" key={p.id} onClick={()=>onProjectClick?.(p)}>
            <div className="project-header">
              <h3 className="project-name">{p.name}</h3>
              <span className={`project-status ${p.status.toLowerCase().replaceAll(' ','-')}`}>{p.status}</span>
            </div>
            <p className="project-description">{p.description}</p>
            <div className="project-tags">
              {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
            <div className="project-progress">
              <div className="progress-track">
                <div className={`progress-fill ${p.progress >= 80 ? 'success' : p.progress < 40 ? 'warning' : ''}`}
                     style={{ width: p.progress + '%' }}/>
              </div>
              <div className="progress-meta">
                <span>{p.doneCount}/{p.taskCount} tareas</span>
                <span>{p.progress}%</span>
              </div>
            </div>
            <div className="project-meta-row" style={{justifyContent:'space-between'}}>
              <span className="meta-chip"><Icon name="calendar" size={11}/> {window.formatDate(p.startDate)} — {window.formatDate(p.endDate)}</span>
              <div className="project-members">
                {p.members.map((m,i) => <div key={i} className="avatar-sm user-avatar">{m}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

window.Projects = Projects;
