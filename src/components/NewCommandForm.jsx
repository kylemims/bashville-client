import { useState } from "react";

export const NewCommandForm = ({ onSave, onCancel, disabled }) => {
  const [formData, setFormData] = useState({
    label: "",
    command_text: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.label.trim() && formData.command_text.trim()) {
      onSave(formData);
      setFormData({ label: "", command_text: "" });
    }
  };

  return (
    <div className="new-command-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="edit-input"
          placeholder="Command label (e.g., 'Install Dependencies')"
          required
          disabled={disabled}
          autoFocus
        />
        <input
          type="text"
          value={formData.command_text}
          onChange={(e) => setFormData({ ...formData, command_text: e.target.value })}
          className="edit-input"
          placeholder="Command text (e.g., 'npm install')"
          required
          disabled={disabled}
        />
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={disabled}>
            Add New
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn" disabled={disabled}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
