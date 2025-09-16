import { useState } from "react";
import { FormField } from "../common/FormField.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import "./ColorPaletteForm.css";
import "./ColorPaletteCard.css";
import "./ColorEditor.css";
import "./LiveColorPreview.css";
import { PaletteValidationSummary } from "./PaletteValidationSummary.jsx";
import "./PaletteValidationSummary.css";
import { AdvancedStyleControls } from "./AdvancedStyleControls.jsx";
import "./AdvancedStyleControls.css";
import { LiveColorPreview } from "./LiveColorPreview.jsx";

const DEFAULT_COLORS = {
  name: "",
  primary_hex: "#fee394",
  secondary_hex: "#d46a6a",
  accent_hex: "#46cba7",
  background_hex: "#0c0806",
  ui_hex: "#efefef",
  style_preferences: {},
};

export const ColorPaletteForm = ({ palette, onSubmit, onCancel, disabled, isEditing = false }) => {
  const [formData, setFormData] = useState(palette || DEFAULT_COLORS);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (newStylePreferences) => {
    setFormData((prev) => ({
      ...prev,
      style_preferences: newStylePreferences,
    }));
  };

  const handleTogglePreview = (isMobile) => {
    setIsMobilePreview(isMobile);
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
      description: "Main brand color - used for primary buttons and hero sections",
      example: "Primary button, hero background",
    },
    {
      name: "secondary_hex",
      label: "Secondary",
      placeholder: "#d46a6a",
      description: "Secondary brand color - used for secondary buttons and gradients",
      example: "Secondary button, gradient accent",
    },
    {
      name: "accent_hex",
      label: "Accent",
      placeholder: "#46cba7",
      description: "Accent color - used for call-to-action buttons and highlights",
      example: "CTA button, links, emphasis",
    },
    {
      name: "background_hex",
      label: "Background",
      placeholder: "#0c0806",
      description: "Page background - the main canvas color behind all content",
      example: "Page background, content area",
    },
    {
      name: "ui_hex",
      label: "UI Elements",
      placeholder: "#efefef",
      description: "UI components - used for cards, navigation, footer (text auto-adjusts)",
      example: "Cards, navbar, footer, forms",
    },
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
            {colorFields.map((field) => (
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
                </div>
                <p className="color-field-description">{field.description}</p>
                {/* <p className="color-field-example">Used for: {field.example}</p> */}
              </div>
            ))}
          </div>

          {/* Advanced Style Controls */}
          <AdvancedStyleControls
            formData={formData}
            onStyleChange={handleStyleChange}
            className="advanced-controls"
          />

          <div className="form-actions">
            <ActionButton type="submit" variant="primary" disabled={disabled || !formData.name.trim()}>
              {isEditing ? "Update Palette" : "Create Palette"}
            </ActionButton>
            <ActionButton type="button" variant="secondary" onClick={onCancel} disabled={disabled}>
              Cancel
            </ActionButton>
          </div>
        </form>

        {/* Sticky Live Preview */}
        <div className="palette-preview-section">
          <div className="sticky-preview">
            {/* Mobile/Desktop Toggle */}
            <div className="preview-toggle-container">
              <div className="preview-toggle-header">
                <h4>Live Preview</h4>
                <div className="preview-toggle-buttons">
                  <button
                    type="button"
                    className={`preview-toggle-btn ${!isMobilePreview ? "active" : ""}`}
                    onClick={() => handleTogglePreview(false)}
                    aria-label="Desktop preview"
                    title="Desktop preview">
                    <MaterialIcon icon="desktop_windows" size="18px" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    className={`preview-toggle-btn ${isMobilePreview ? "active" : ""}`}
                    onClick={() => handleTogglePreview(true)}
                    aria-label="Mobile preview"
                    title="Mobile preview">
                    <MaterialIcon icon="smartphone" size="18px" />
                    Mobile
                  </button>
                </div>
              </div>
            </div>

            <LiveColorPreview
              formData={formData}
              isVisible={true}
              isMobilePreview={isMobilePreview}
              onTogglePreview={handleTogglePreview}
            />
          </div>
        </div>
      </div>
      <PaletteValidationSummary formData={formData} />

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
    </div>
  );
};
