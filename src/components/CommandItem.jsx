import { useState } from "react";

export const CommandItem = ({ command, isEditing, onEdit, onSave, onCancel, onDelete, disabled }) => {
  const [formData, setFormData] = useState({
    label: command.label,
    command_text: command.command_text,
  });

  const handleSave = () => {
    if (formData.label.trim() && formData.command_text.trim()) {
      onSave(formData);
    }
  };

  if (isEditing) {
    return (
      <div className="command-item editing">
        <div className="command-edit-form">
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="edit-input"
            placeholder="Command label"
            disabled={disabled}
          />
          <input
            type="text"
            value={formData.command_text}
            onChange={(e) => setFormData({ ...formData, command_text: e.target.value })}
            className="edit-input"
            placeholder="Command text"
            disabled={disabled}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn" disabled={disabled}>
              ✓
            </button>
            <button onClick={onCancel} className="cancel-btn" disabled={disabled}>
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="command-item">
      <div className="command-content">
        <div className="command-label">{command.label}</div>
        <div className="command-text">{command.command_text}</div>
      </div>
      <div className="command-actions">
        <button onClick={onEdit} className="action-btn edit-btn" disabled={disabled}>
          ✏️
        </button>
        <button onClick={onDelete} className="action-btn delete-btn" disabled={disabled}>
          🗑️
        </button>
      </div>
    </div>
  );
};
