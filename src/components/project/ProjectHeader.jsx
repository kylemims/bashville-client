import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { useState, useEffect } from "react";
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
  useEffect(() => {
    if (!isEditing) setEditTitle(title);
  }, [title, isEditing]);

  const handleEditCancel = () => {
    setEditTitle(title);
    setIsEditing(false);
    setError("");
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    if (editTitle.trim() === title.trim()) {
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
      <div className="header-main-row">
        <div className="project-title-section">
          <ActionButton variant="accent" onClick={onBack} title="Back to Dashboard">
            <MaterialIcon icon="arrow_back_2" size={22} />
          </ActionButton>
          <ActionButton
            onClick={onGenerateSetup}
            variant="accent"
            size="sm"
            aria-label="Generate Setup Script & README"
            disabled={isEditing}>
            <MaterialIcon icon="rocket_launch" size={22} />
          </ActionButton>
          {/* <div className="project-actions"> */}
          {isEditing ? (
            <div className="project-title-edit">
              <input
                type="text"
                aria-label="Project name"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`project-title-input ${error ? "error" : ""}`}
                placeholder="Enter project name"
                disabled={isUpdating}
                autoFocus
                maxLength={100}
              />
              <div className="title-edit-actions">
                <ActionButton
                  onClick={handleEditSave}
                  variant="accent"
                  size="sm"
                  disabled={isUpdating || !editTitle.trim()}
                  title="Save (Enter)">
                  {isUpdating ? (
                    <MaterialIcon icon="hourglass_empty" size={22} />
                  ) : (
                    <MaterialIcon icon="check" size={22} />
                  )}
                </ActionButton>
                <ActionButton
                  onClick={handleEditCancel}
                  variant="accent"
                  size="sm"
                  disabled={isUpdating}
                  title="Cancel (Esc)">
                  <MaterialIcon icon="close" size={22} />
                </ActionButton>
              </div>
              {error && <span className="title-edit-error">{error}</span>}
            </div>
          ) : (
            <ActionButton
              onClick={handleEditStart}
              variant="accent"
              size="sm"
              title="Edit project name"
              aria-label="Edit project name"
              disabled={isEditing}
              className="title-header-edit">
              <MaterialIcon icon="person_edit" size={22} />
            </ActionButton>
          )}

          <ActionButton
            onClick={onProjectDelete}
            variant="accent"
            size="sm"
            aria-label="Delete Project"
            disabled={isEditing}>
            <MaterialIcon icon="delete" size={22} />
          </ActionButton>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};
