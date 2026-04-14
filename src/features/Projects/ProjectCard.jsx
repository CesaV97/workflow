/**
 * ProjectCard component - Displays a single project
 *
 * @param {object} project - Project object
 */
export function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-card-title">{project.name}</h3>
        <span className="project-card-status">{project.status}</span>
      </div>
      <p className="project-card-description">{project.description || 'No description'}</p>
      <div className="project-card-footer">
        <span className="project-card-date">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
