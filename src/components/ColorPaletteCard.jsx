import "./ColorPaletteCard.css";
import { ActionButton } from "./ActionButton.jsx";

export const ColorPaletteCard = ({ palette, isSelected, onClick, onEdit, onDelete, disabled }) => {
  return (
    <div className={`palette-card ${isSelected ? "selected" : ""}`} onClick={onClick}>
      <div className="palette-preview">
        <div className="color-swatch-row">
          <div
            className="color-swatch primary"
            style={{ backgroundColor: palette.primary_hex }}
            title={`Primary: ${palette.primary_hex}`}
          />
          <div
            className="color-swatch secondary"
            style={{ backgroundColor: palette.secondary_hex }}
            title={`Secondary: ${palette.secondary_hex}`}
          />
          <div
            className="color-swatch accent"
            style={{ backgroundColor: palette.accent_hex }}
            title={`Accent: ${palette.accent_hex}`}
          />
          <div
            className="color-swatch background"
            style={{ backgroundColor: palette.background_hex }}
            title={`Background: ${palette.background_hex}`}
          />
        </div>
      </div>

      <div className="palette-info">
        <h4 className="palette-name">{palette.name}</h4>
        <div className="palette-colors">
          {palette.primary_hex} • {palette.secondary_hex} • {palette.accent_hex}
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div className="palette-actions">
          {onEdit && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              variant="edit"
              disabled={disabled}
              size="sm">
              ✏️
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              variant="delete"
              disabled={disabled}
              size="sm">
              🗑️
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};
