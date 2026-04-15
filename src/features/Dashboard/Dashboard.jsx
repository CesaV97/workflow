import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import './Dashboard.css';

export function Dashboard() {
  const { projects, projectCount } = useProjects();
  const { tasks, taskCount } = useTasks();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-value">{projectCount()}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-value">{taskCount()}</span>
            <span className="stat-label">Tasks</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2 className="section-title">Projects ({projects.length})</h2>
          {projects.length === 0 ? (
            <p className="empty-state">No projects yet</p>
          ) : (
            <div className="project-grid">
              {projects.map((p) => (
                <div key={p.id} className="project-card">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet</p>
          ) : (
            <ul className="task-list">
              {tasks.map((t) => (
                <li key={t.id} className="task-item">
                  {t.name} - {t.status}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
