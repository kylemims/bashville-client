import { useState } from "react";
import { createCommand, updateCommand, deleteCommand } from "../services/commandService.js";

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
        </div>
      </div>
    </div>
  );
};
