import { useState } from "react";
import {
  createColorPalette,
  updateColorPalette,
  deleteColorPalette,
} from "../../services/colorPaletteService";
import { ColorPaletteForm } from "./ColorPaletteForm";
import { ColorPaletteCard } from "./ColorPaletteCard";
import { ActionButton } from "../common/ActionButton";
import { ErrorMessage } from "../common/ErrorMessage";

export const ColorsTab = ({ project, availablePalettes, onSave, onPalettesUpdate }) => {
  const [selectedPaletteId, setSelectedPaletteId] = useState(project.color_palette?.id || null);
  const [showNewPaletteForm, setShowNewPaletteForm] = useState(false);
  const [editingPalette, setEditingPalette] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPalette = project.color_palette_preview;

  const handleSelectPalette = async (paletteId) => {
    try {
      setSelectedPaletteId(paletteId);
      await onSave({ color_palette: paletteId });
    } catch (err) {
      setError(`Failed to update color palette: ${err.message}`);
    }
  };

  const handleCreatePalette = async (paletteData) => {
    try {
      setLoading(true);
      const newPalette = await createColorPalette(paletteData);
      const updatedPalettes = [...availablePalettes, newPalette];
      onPalettesUpdate(updatedPalettes);
      setShowNewPaletteForm(false);
      await handleSelectPalette(newPalette.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePalette = async (paletteId, paletteData) => {
    try {
      setLoading(true);
      const updatedPalette = await updateColorPalette(paletteId, paletteData);
      const updatedPalettes = availablePalettes.map((palette) =>
        palette.id === paletteId ? updatedPalette : palette
      );
      onPalettesUpdate(updatedPalettes);
      setEditingPalette(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePalette = async (paletteId) => {
    if (!window.confirm("Are you sure you want to delete this color palette?")) return;

    try {
      setLoading(true);
      await deleteColorPalette(paletteId);
      const updatedPalettes = availablePalettes.filter((palette) => palette.id !== paletteId);
      onPalettesUpdate(updatedPalettes);

      if (selectedPaletteId === paletteId) {
        setSelectedPaletteId(null);
        await onSave({ color_palette: null });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="colors-tab">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Palette Stash</h2>
          <ActionButton onClick={() => setShowNewPaletteForm(true)} disabled={loading} variant="add">
            +
          </ActionButton>
        </div>

        <ErrorMessage message={error} />

        {currentPalette && (
          <div className="current-palette">
            <h3 className="subsection-title">Current Palette</h3>
            <ColorPaletteCard
              palette={currentPalette}
              isSelected={true}
              onEdit={() => setEditingPalette(currentPalette.id)}
              onDelete={() => handleDeletePalette(currentPalette.id)}
              disabled={loading}
            />
          </div>
        )}

        {showNewPaletteForm && (
          <ColorPaletteForm
            onSubmit={handleCreatePalette}
            onCancel={() => setShowNewPaletteForm(false)}
            disabled={loading}
          />
        )}

        {editingPalette && (
          <ColorPaletteForm
            palette={availablePalettes.find((p) => p.id === editingPalette)}
            onSubmit={(data) => handleUpdatePalette(editingPalette, data)}
            onCancel={() => setEditingPalette(null)}
            disabled={loading}
            isEditing
          />
        )}
      </div>

      <div className="section">
        <h2 className="section-title">Available Palettes</h2>
        <div className="palette-grid">
          {availablePalettes.map((palette) => (
            <ColorPaletteCard
              key={palette.id}
              palette={palette}
              isSelected={selectedPaletteId === palette.id}
              onClick={() => handleSelectPalette(palette.id)}
              onEdit={() => setEditingPalette(palette.id)}
              onDelete={() => handleDeletePalette(palette.id)}
              disabled={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
