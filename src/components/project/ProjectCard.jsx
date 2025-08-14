import { Link } from "react-router-dom";
import { ActionButton } from "../common/ActionButton.jsx";
import "./ProjectCard.css";

export const ProjectCard = ({ project, onDelete, onLaunch, isDeleting }) => {
  const hasCommands = project.commands_preview && project.commands_preview.length > 0;
  const hasColors = project.color_palette_preview;

  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">{project.title}</h3>

        {project.description && <p className="project-description">{project.description}</p>}

        <div className="project-stats">
          <div className="project-stat">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">
              {hasCommands ? `${project.commands_preview.length} commands` : "No commands"}
            </span>
          </div>
          <div className="project-stat">
            <span className="stat-icon">🎨</span>
            <span className="stat-text">{hasColors ? project.color_palette_preview.name : "No palette"}</span>
          </div>
        </div>

        <Link to={`/projects/${project.id}`} className="project-view-btn">
          VIEW PROJECT
        </Link>
      </div>
      <div className="project-actions">
        <Link
          to={`/projects/${project.id}`}
          className="action-btn edit-btn"
          title="Edit Project"
          aria-label="Edit project">
          ✏️
        </Link>
        <ActionButton
          onClick={() => onDelete(project.id)}
          variant="delete"
          size="sm"
          disabled={isDeleting}
          title="Delete Project"
          aria-label="Delete project">
          {isDeleting ? "⏳" : "🗑️"}
        </ActionButton>
        <ActionButton
          onClick={() => onLaunch(project)}
          variant="launch"
          size="sm"
          title="Launch Project"
          aria-label="Launch project">
          🚀
        </ActionButton>
      </div>
    </div>
  );
};
