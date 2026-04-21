import { useProjects } from '../../hooks/useProjects';
import { useTasksContext } from '../../context/TasksContext';
import { ProjectGrid } from './ProjectGrid';
import { WeeklyTasksList } from './WeeklyTasksList';
import './Dashboard.css';

function Sparkline({ values, color = 'var(--color-accent)' }) {
  const w = 120, h = 24;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - (v / max) * h,
  ]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <svg className="kpi-sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={color} fillOpacity="0.12" />
    </svg>
  );
}

export function Dashboard({ onTaskSelect, onNavigate, onNewTask }) {
  const projectsHook = useProjects();
  const tasksHook = useTasksContext();
  const { projects, loading: projectsLoading, error: projectsError } = projectsHook;
  const { tasks, loading: tasksLoading, error: tasksError } = tasksHook;

  const activeProjects = projects.filter(p => p.status === 'Active');
  const openTasks = tasks.filter(t => t.status !== 'Done');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const today = new Date();
  const todayStr = today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Buen día. Hoy es {todayStr}.</p>
      </div>

      <div className="dashboard-kpis">
        <div className="kpi-card">
          <div className="kpi-label">Proyectos activos</div>
          <div className="kpi-row">
            <div className="kpi-value">{activeProjects.length}</div>
            <span className="kpi-unit">de {projects.length}</span>
          </div>
          <Sparkline values={[0, 1, 1, 2, 2, activeProjects.length]} />
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tareas abiertas</div>
          <div className="kpi-row">
            <div className="kpi-value">{openTasks.length}</div>
            <span className="kpi-unit">tareas</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completadas</div>
          <div className="kpi-row">
            <div className="kpi-value">{doneTasks.length}</div>
            <span className="kpi-unit">tareas</span>
            {doneTasks.length > 0 && <span className="kpi-delta up">✓</span>}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total tareas</div>
          <div className="kpi-row">
            <div className="kpi-value">{tasks.length}</div>
            <span className="kpi-unit">registradas</span>
          </div>
        </div>
      </div>

      {(projectsError || tasksError) && (
        <div className="dashboard-error">{projectsError || tasksError}</div>
      )}

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Proyectos activos</h2>
            <span className="section-meta">{activeProjects.length} activos</span>
          </div>
          {projectsLoading ? (
            <p className="empty-state">Cargando proyectos...</p>
          ) : (
            <ProjectGrid
              projects={projects}
              tasks={tasks}
              onAdd={projectsHook.addProject}
              onUpdate={projectsHook.updateProject}
              onDelete={projectsHook.deleteProject}
            />
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Esta semana</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="section-meta">{openTasks.length} pendientes</span>
              <button className="btn-nuevo" onClick={onNewTask} style={{ padding: '5px 12px' }}>
                + Nueva tarea
              </button>
            </div>
          </div>
          {tasksLoading ? (
            <p className="empty-state">Cargando tareas...</p>
          ) : (
            <WeeklyTasksList tasks={tasks} onTaskClick={onTaskSelect} />
          )}
        </section>
      </div>
    </main>
  );
}
