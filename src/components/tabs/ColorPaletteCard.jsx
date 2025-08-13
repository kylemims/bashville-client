import { useState } from "react";
import { ActionButton } from "../common/ActionButton.jsx";
import { ColorEditor } from "./ColorEditor.jsx";
import "./ColorPaletteCard.css";

export const ColorPaletteCard = ({
  palette,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onQuickColorEdit,
  disabled,
}) => {
  const [editingColor, setEditingColor] = useState(null);

  const colorFields = [
    { key: "primary_hex", name: "Primary", value: palette.primary_hex },
    { key: "secondary_hex", name: "Secondary", value: palette.secondary_hex },
    { key: "accent_hex", name: "Accent", value: palette.accent_hex },
    { key: "background_hex", name: "Background", value: palette.background_hex },
  ];

  const handleQuickColorSave = async (colorKey, newHexValue) => {
    if (onQuickColorEdit) {
      try {
        await onQuickColorEdit(palette.id, { [colorKey]: newHexValue });
        setEditingColor(null);
      } catch (error) {
        console.error("Failed to update color:", error);
      }
    }
  };

  return (
    <div className={`color-palette-card ${isSelected ? "selected" : ""}`}>
      <div className="palette-header">
        <h3 className="palette-name" onClick={onClick}>
          {palette.name}
        </h3>
        <div className="palette-actions">
          <ActionButton
            onClick={onEdit}
            variant="edit"
            size="sm"
            disabled={disabled}
            aria-label={`Edit ${palette.name}`}>
            ✏️
          </ActionButton>
          <ActionButton
            onClick={onDelete}
            variant="delete"
            size="sm"
            disabled={disabled}
            aria-label={`Delete ${palette.name}`}>
            🗑️
          </ActionButton>
        </div>
      </div>

      <div className="color-swatches">
        {colorFields.map((color) => (
          <div key={color.key} className="color-item">
            {editingColor === color.key ? (
              <ColorEditor
                colorName={color.name}
                colorValue={color.value}
                onSave={(newHex) => handleQuickColorSave(color.key, newHex)}
                onCancel={() => setEditingColor(null)}
                disabled={disabled}
              />
            ) : (
              <div className="color-display">
                <div
                  className="color-swatch clickable"
                  style={{ backgroundColor: color.value }}
                  onClick={() => setEditingColor(color.key)}
                  title={`Click to edit ${color.name} color`}
                />
                <div className="color-info">
                  <span className="color-label">{color.name}</span>
                  <span className="color-hex">{color.value}</span>
                  <ActionButton
                    onClick={() => setEditingColor(color.key)}
                    variant="edit"
                    size="xs"
                    disabled={disabled}
                    aria-label={`Quick edit ${color.name}`}>
                    ✏️
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
