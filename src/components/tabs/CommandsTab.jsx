/* filepath: src/components/tabs/CommandsTab.jsx */
import { useState } from "react";
import { createCommand, updateCommand, deleteCommand } from "../../services/commandService.js";
import { ErrorMessage } from "../common/ErrorMessage.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import { CommandItem } from "./CommandItem.jsx";
import { NewCommandForm } from "./NewCommandForm.jsx";
import "./CommandsTab.css";

export const CommandsTab = ({ project, availableCommands, onSave, onCommandsUpdate }) => {
  const [selectedCommands, setSelectedCommands] = useState(project.commands_preview?.map((c) => c.id) || []);
  const [showNewCommandForm, setShowNewCommandForm] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const projectCommands = project.commands_preview || [];

  const handleToggleCommand = async (commandId) => {
    const newSelected = selectedCommands.includes(commandId)
      ? selectedCommands.filter((id) => id !== commandId)
      : [...selectedCommands, commandId];

    setSelectedCommands(newSelected);

    try {
      await onSave({ command_ids: newSelected });
      setError("");
    } catch (err) {
      setError(`Failed to update commands: ${err.message}`);
      // Revert on error
      setSelectedCommands(selectedCommands);
    }
  };

  const handleCreateCommand = async (commandData) => {
    try {
      setLoading(true);
      setError("");
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
      setError("");
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
      setError("");
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
          <ActionButton
            onClick={() => setShowNewCommandForm(true)}
            disabled={loading}
            variant="add"
            aria-label="Add new command">
            +
          </ActionButton>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError("")} />

        <div className="command-dropdown">
          <select className="dropdown-select" disabled>
            <option>Quick Actions (Coming Soon)</option>
          </select>
        </div>

        <div className="command-list">
          {projectCommands.length > 0 ? (
            projectCommands.map((command) => (
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
            ))
          ) : (
            <p className="empty-message">No commands in this project yet.</p>
          )}
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
          {availableCommands.length > 0 ? (
            availableCommands.map((command) => (
              <div
                key={command.id}
                className={`command-card ${selectedCommands.includes(command.id) ? "selected" : ""}`}
                onClick={() => handleToggleCommand(command.id)}
                role="button"
                tabIndex={0}>
                <div className="command-card-content">
                  <h4>{command.label}</h4>
                  <code>{command.command_text}</code>
                </div>
                <div className="command-card-actions">
                  <ActionButton
                    variant="edit"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCommand(command.id);
                    }}
                    disabled={loading}
                    aria-label={`Edit ${command.label}`}>
                    ✏️
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCommand(command.id);
                    }}
                    disabled={loading}
                    aria-label={`Delete ${command.label}`}>
                    🗑️
                  </ActionButton>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">No commands available. Create your first command above!</p>
          )}
        </div>
      </div>
    </div>
  );
};
