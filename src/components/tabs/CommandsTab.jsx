import { useState } from "react";
import { createCommand, updateCommand, deleteCommand } from "../../services/commandService.js";
import { ErrorMessage } from "../common/ErrorMessage.jsx";
import { CommandItem } from "./CommandItem.jsx";
import { NewCommandForm } from "./NewCommandForm.jsx";

export const CommandsTab = ({ project, availableCommands, onSave, onCommandsUpdate }) => {
  const [selectedCommands, setSelectedCommands] = useState(project.commands_preview?.map((c) => c.id) || []);
  const [showNewCommandForm, setShowNewCommandForm] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const projectCommands = project.commands_preview || [];

  const handleToggleCommand = (commandId) => {
    const newSelected = selectedCommands.includes(commandId)
      ? selectedCommands.filter((id) => id !== commandId)
      : [...selectedCommands, commandId];
    setSelectedCommands(newSelected);

    // Auto-save project with new command selection
    onSave({ command_ids: newSelected }).catch((err) => {
      setError(`Failed to update commands: ${err.message}`);
    });
  };
  const handleCreateCommand = async (commandData) => {
    try {
      setLoading(true);
      const newCommand = await createCommand(commandData);
      const updatedCommands = [...availableCommands, newCommand];
      onCommandsUpdate(updatedCommands);
      setShowNewCommandForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommand = async (commandId, commandData) => {
    try {
      setLoading(true);
      const updatedCommand = await updateCommand(commandId, commandData);
      const updatedCommands = availableCommands.map((cmd) => (cmd.id === commandId ? updatedCommand : cmd));
      onCommandsUpdate(updatedCommands);
      setEditingCommand(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommand = async (commandId) => {
    if (!window.confirm("Are you sure you want to delete this command?")) return;
    try {
      setLoading(true);
      await deleteCommand(commandId);
      const updatedCommands = availableCommands.filter((cmd) => cmd.id !== commandId);
      onCommandsUpdate(updatedCommands);

      // Remove from selected if it was selected
      if (selectedCommands.includes(commandId)) {
        const newSelected = selectedCommands.filter((id) => id !== commandId);
        setSelectedCommands(newSelected);
        await onSave({ command_ids: newSelected });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="commands-tab">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Command Stash</h2>
          <button className="add-button" onClick={() => setShowNewCommandForm(true)} disabled={loading}>
            +
          </button>
        </div>
        <ErrorMessage message={error} />
        <div className="command-dropdown">
          <select className="dropdown-select">
            <option>Install Dependencies: npm install</option>
          </select>
        </div>

        <div className="command-list">
          {projectCommands.map((command) => (
            <CommandItem
              key={command.id}
              command={command}
              isEditing={editingCommand === command.id}
              onEdit={() => setEditingCommand(command.id)}
              onSave={(data) => handleUpdateCommand(command.id, data)}
              onCancel={() => setEditingCommand(null)}
              onDelete={() => handleDeleteCommand(command.id)}
              disabled={loading}
            />
          ))}
        </div>

        {showNewCommandForm && (
          <NewCommandForm
            onSave={handleCreateCommand}
            onCancel={() => setShowNewCommandForm(false)}
            disabled={loading}
          />
        )}
      </div>

      <div className="section">
        <h2 className="section-title">Available Commands</h2>
        <div className="available-commands-grid">
          {availableCommands.map((command) => (
            <div
              key={command.id}
              className={`command-card ${selectedCommands.includes(command.id) ? "selected" : ""}`}
              onClick={() => handleToggleCommand(command.id)}>
              <div className="command-card-content">
                <h4>{command.label}</h4>
                <code>{command.command_text}</code>
              </div>
              <div className="command-card-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCommand(command.id);
                  }}>
                  ✏️
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCommand(command.id);
                  }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
