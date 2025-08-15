import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { useState } from "react";
import "./ProjectHeader.css";

export const ProjectHeader = ({ title, onBack, onGenerateSetup, onProjectDelete, onProjectUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleEditStart = () => {
    setEditTitle(title);
    setIsEditing(true);
    setError("");
  };

  const handleEditCancel = () => {
    setEditTitle(title);
    setIsEditing(true);
    setError("");
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    if (editTitle.trim() === title.trim()) {
      // No change, just exit edit mode
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onProjectUpdate({ title: editTitle.trim() });
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to update project name");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div className="project-header">
      <ActionButton onClick={onBack} variant="back" aria-label="Back to Dashboard">
        ←
      </ActionButton>

      <div className="project-title-section">
        {isEditing ? (
          <div className="project-title-edit">
            <span className="title-bracket">&lt;</span>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`project-title-input ${error ? "error" : ""}`}
              placeholder="Enter project name"
              disabled={isUpdating}
              autoFocus
              maxLength={100}
            />
            <span className="title-bracket"> /&gt;</span>

            <div className="title-edit-actions">
              <ActionButton
                onClick={handleEditSave}
                variant="primary"
                size="sm"
                disabled={isUpdating || !editTitle.trim()}
                title="Save (Enter)">
                {isUpdating ? (
                  <MaterialIcon icon="hourglass_empty" size={18} />
                ) : (
                  <MaterialIcon icon="check" size={18} />
                )}
              </ActionButton>
              <ActionButton
                onClick={handleEditCancel}
                variant="secondary"
                size="sm"
                disabled={isUpdating}
                title="Cancel (Esc)">
                <MaterialIcon icon="close" size={18} />
              </ActionButton>
            </div>

            {error && <span className="title-edit-error">{error}</span>}
          </div>
        ) : (
          <div className="project-title-display">
            <h1 className="project-title">&lt;{title} /&gt;</h1>
          </div>
        )}
      </div>

      <div className="project-actions">
        <ActionButton
          onClick={onGenerateSetup}
          variant="accent"
          size="sm"
          aria-label="Generate Setup Script & README"
          disabled={isEditing}>
          <MaterialIcon icon="markdown" size={24} color="var(--color-bg)" className="hover-primary" />
        </ActionButton>
        <ActionButton
          onClick={handleEditStart}
          variant="muted"
          size="sm"
          title="Edit project name"
          aria-label="Edit project name">
          <MaterialIcon icon="edit_square" size={24} color="var(--color-bg)" className="hover-primary" />
        </ActionButton>
        <ActionButton
          onClick={onProjectDelete}
          variant="secondary"
          size="sm"
          aria-label="Delete Project"
          disabled={isEditing}>
          <MaterialIcon icon="delete" size={24} color="var(--color-bg)" className="hover-primary" />
        </ActionButton>
      </div>
    </div>
  );
};
