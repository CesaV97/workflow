const { useState: useStateT } = React;

function Tasks({ tasks, projects, onTaskSelect, selectedTaskId }) {
  const Icon = window.Icon;
  const [filter, setFilter] = useStateT('Todos');
  const [projectFilter, setProjectFilter] = useStateT('all');

  const statusOptions = ['Todos', 'To Do', 'In Progress', 'Paused', 'Blocked', 'Done'];
  const filtered = tasks.filter(t => {
    if (filter !== 'Todos' && t.status !== filter) return false;
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    return true;
  });

  return (
    <main className="page" data-screen-label="03 Tareas">
      <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <div>
          <h1 className="page-title">Tareas</h1>
          <p className="page-subtitle">{filtered.length} de {tasks.length} tareas</p>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Nueva tarea</button>
      </div>

      <div className="tasks-toolbar">
        <span style={{color:'var(--color-text-secondary)', fontSize:12, marginRight:4}}>Estatus:</span>
        {statusOptions.map(s => (
          <button key={s}
                  className={`filter-chip ${filter===s?'active':''}`}
                  onClick={()=>setFilter(s)}>
            {s}
          </button>
        ))}
        <div style={{width:1, height:20, background:'var(--color-border)', margin:'0 6px'}}/>
        <select
          value={projectFilter}
          onChange={e=>setProjectFilter(e.target.value)}
          style={{background:'var(--color-bg-primary)', border:'1px solid var(--color-border)', color:'var(--color-text-primary)', padding:'4px 8px', borderRadius:6, fontSize:12}}>
          <option value="all">Todos los proyectos</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="tasks-list">
        {filtered.map(t => (
          <div key={t.id}
               className={`task-item ${selectedTaskId===t.id?'selected':''}`}
               onClick={()=>onTaskSelect(t)}>
            <div className="task-item-main">
              <div className="task-item-header">
                <div>
                  <h3 className="task-name">{t.name}</h3>
                  <div className="task-project-name">{t.projectName}</div>
                </div>
                <window.StatusPill status={t.status}/>
              </div>
              {t.description && <p className="task-description">{t.description}</p>}
              <div className="task-item-footer">
                <span className="meta-chip"><Icon name="calendar" size={11}/> Vence {window.formatDate(t.endDate)}</span>
                {t.pomodoroCount>0 && <span className="meta-chip"><Icon name="clock" size={11}/> {t.pomodoroCount} pomodoros</span>}
                {t.commentCount>0 && <span className="meta-chip"><Icon name="message" size={11}/> {t.commentCount}</span>}
              </div>
            </div>
            <div className="task-item-actions" onClick={e=>e.stopPropagation()}>
              <button className="btn btn-ghost" aria-label="Editar"><Icon name="edit" size={12}/></button>
              <button className="btn btn-ghost" aria-label="Eliminar"><Icon name="trash" size={12}/></button>
            </div>
          </div>
        ))}
        {filtered.length===0 && <p className="empty-state">Sin tareas que coincidan con el filtro.</p>}
      </div>
    </main>
  );
}

window.Tasks = Tasks;
