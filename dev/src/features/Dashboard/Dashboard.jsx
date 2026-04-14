import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectGrid } from './ProjectGrid';
import { WeeklyTasksList } from './WeeklyTasksList';
import './Dashboard.css';

/**
 * Dashboard component - Main overview page
 * Displays project summary and upcoming tasks
 */
export function Dashboard() {
  const { projects, projectCount } = useProjects();
  const { tasks, taskCount } = useTasks();

  return (
    <main className="dashboard">
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

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2 className="section-title">Projects</h2>
          <ProjectGrid projects={projects} />
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Tasks</h2>
          <WeeklyTasksList tasks={tasks} />
        </section>
      </div>
    </main>
  );
}
