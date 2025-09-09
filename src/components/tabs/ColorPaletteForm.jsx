import { useState } from "react";
import { FormField } from "../common/FormField.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import { HoverTooltip } from "../common/HoverTooltip.jsx";
import "./ColorPaletteForm.css";
import "./ColorPaletteCard.css";
import "./ColorEditor.css";
import { LiveColorPreview } from "./LiveColorPreview.jsx";
import { isContrastAccessible } from "../../utils/colorUtils.js";
import "./LiveColorPreview.css";
const DEFAULT_COLORS = {
  name: "",
  primary_hex: "#fee394",
  secondary_hex: "#d46a6a",
  accent_hex: "#46cba7",
  background_hex: "#0c0806",
  ui_hex: "#efefef",
};

export const ColorPaletteForm = ({ palette, onSubmit, onCancel, disabled, isEditing = false }) => {
  const [formData, setFormData] = useState(palette || DEFAULT_COLORS);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const colorFields = [
    {
      name: "primary_hex",
      label: "Primary",
      placeholder: "#fee394",
      description: "Main brand color for buttons and highlights",
    },
    {
      name: "secondary_hex",
      label: "Secondary",
      placeholder: "#d46a6a",
      description: "Secondary accent and gradients",
    },
    {
      name: "accent_hex",
      label: "Accent",
      placeholder: "#46cba7",
      description: "Call-to-action and emphasis",
    },
    {
      name: "background_hex",
      label: "Background",
      placeholder: "#0c0806",
      description: "Page background color",
    },
    { name: "ui_hex", label: "UI Elements", placeholder: "#efefef", description: "Cards, navigation, forms" },
  ];

  return (
    <div className="palette-form-container">
      <h3>{isEditing ? "Edit Color Palette" : "Create New Color Palette"}</h3>

      <div className="palette-form-with-preview">
        <form onSubmit={handleSubmit} className="palette-form">
          <FormField
            label="Palette Name"
            type="text"
            value={formData.name}
            onChange={(value) => handleChange("name", value)}
            placeholder="Dark Theme Magic"
            required
            disabled={disabled}
            autoFocus={!isEditing}
          />

          <div className="color-fields-grid">
            {colorFields.map((field) => {
              // Check contrast for key color combinations
              let contrastOk = true;
              let contrastAgainst = null;

              if (field.name === "accent_hex") {
                contrastOk = isContrastAccessible(formData.accent_hex, formData.background_hex);
                contrastAgainst = "Background";
              } else if (field.name === "primary_hex") {
                contrastOk = isContrastAccessible(formData.primary_hex, formData.ui_hex);
                contrastAgainst = "UI Elements";
              } else if (field.name === "secondary_hex") {
                contrastOk = isContrastAccessible(formData.secondary_hex, formData.background_hex);
                contrastAgainst = "Background";
              } else if (field.name === "background_hex") {
                contrastOk = isContrastAccessible(formData.background_hex, formData.ui_hex);
                contrastAgainst = "UI Elements";
              } else if (field.name === "ui_hex") {
                contrastOk = isContrastAccessible(formData.ui_hex, formData.background_hex);
                contrastAgainst = "Background";
              }

              return (
                <div key={field.name} className="color-field">
                  <div className="color-field-header">
                    <FormField
                      label={field.label}
                      type="color"
                      value={formData[field.name]}
                      onChange={(value) => handleChange(field.name, value)}
                      disabled={disabled}
                    />
                    <FormField
                      type="text"
                      value={formData[field.name]}
                      onChange={(value) => handleChange(field.name, value)}
                      placeholder={field.placeholder}
                      disabled={disabled}
                      className="hex-input"
                    />
                    {!contrastOk && (
                      <HoverTooltip
                        tooltipContent={`Low contrast with ${contrastAgainst}! Consider adjusting colors for better accessibility.`}
                        className="contrast-warning-tooltip">
                        <span className="contrast-warning">⚠️</span>
                      </HoverTooltip>
                    )}
                  </div>
                  <p className="color-field-description">{field.description}</p>
                </div>
              );
            })}
          </div>

          <div className="palette-preview-live">
            <h4>Color Swatches</h4>
            <div className="color-swatch-row">
              {colorFields.map((field) => (
                <div key={field.name} className="color-swatch-item">
                  <div
                    className={`color-swatch ${field.name.replace("_hex", "")}`}
                    style={{ backgroundColor: formData[field.name] }}
                    title={`${field.label}: ${formData[field.name]}`}
                  />
                  <span className="color-swatch-label">{field.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <ActionButton type="submit" variant="primary" disabled={disabled || !formData.name.trim()}>
              {isEditing ? "Update Palette" : "Create Palette"}
            </ActionButton>
            <ActionButton type="button" variant="secondary" onClick={onCancel} disabled={disabled}>
              Cancel
            </ActionButton>
          </div>
        </form>

        {/* Live Preview */}
        <LiveColorPreview formData={formData} />
      </div>
    </div>
  );
};
