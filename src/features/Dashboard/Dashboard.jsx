import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectGrid } from './ProjectGrid';
import { WeeklyTasksList } from './WeeklyTasksList';
import './Dashboard.css';

export function Dashboard({ onTaskSelect }) {
  const projectsHook = useProjects();
  const tasksHook = useTasks();
  const { projects, loading: projectsLoading, error: projectsError } = projectsHook;
  const { tasks, taskCount, loading: tasksLoading, error: tasksError } = tasksHook;

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-value">{projects.length}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-value">{taskCount()}</span>
            <span className="stat-label">Tasks</span>
          </div>
        </div>
      </div>

      {(projectsError || tasksError) && (
        <div className="dashboard-error">{projectsError || tasksError}</div>
      )}

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2 className="section-title">Proyectos activos</h2>
          {projectsLoading ? (
            <p className="empty-state">Cargando proyectos...</p>
          ) : (
            <ProjectGrid
              projects={projects}
              onAdd={projectsHook.addProject}
              onUpdate={projectsHook.updateProject}
              onDelete={projectsHook.deleteProject}
            />
          )}
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Esta semana</h2>
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
