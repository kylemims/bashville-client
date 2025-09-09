import { useEffect, useMemo } from "react";
import { isContrastAccessible } from "../../utils/colorUtils.js";
import { HoverTooltip } from "../common/HoverTooltip.jsx";
import "./LiveColorPreview.css";

// Simple Live Preview component that you can add to your existing ColorPaletteForm
export const LiveColorPreview = ({ formData }) => {
  const colors = useMemo(
    () => ({
      primary_hex: formData?.primary_hex || "#3b82f6",
      secondary_hex: formData?.secondary_hex || "#1e40af",
      accent_hex: formData?.accent_hex || "#06b6d4",
      background_hex: formData?.background_hex || "#f8fafc",
      ui_hex: formData?.ui_hex || "#ffffff",
    }),
    [
      formData?.primary_hex,
      formData?.secondary_hex,
      formData?.accent_hex,
      formData?.background_hex,
      formData?.ui_hex,
    ]
  );

  // Check contrast for preview elements
  const cardTitleContrastOk = isContrastAccessible(
    formData?.primary_hex || "#3b82f6",
    formData?.ui_hex || "#ffffff"
  );
  useEffect(() => {
    // Update CSS custom properties for live preview
    const root = document.documentElement;
    root.style.setProperty("--preview-primary", colors.primary_hex);
    root.style.setProperty("--preview-secondary", colors.secondary_hex);
    root.style.setProperty("--preview-accent", colors.accent_hex);
    root.style.setProperty("--preview-background", colors.background_hex);
    root.style.setProperty("--preview-ui", colors.ui_hex);
  }, [colors]);

  return (
    <div className="live-preview-container">
      <h4>Live Preview</h4>
      <div className="color-preview-container">
        <div className="color-preview-navbar">
          <div className="color-preview-logo">Your Site</div>
          <div className="color-preview-nav-links">
            <span className="color-preview-nav-link">Home</span>
            <span className="color-preview-nav-link">About</span>
            <span className="color-preview-nav-link">Contact</span>
          </div>
        </div>

        <div className="color-preview-content">
          <div className="color-preview-hero">
            <h2>Welcome to Your Site</h2>
            <p>See your colors come to life</p>
            <div className="color-preview-buttons">
              <button className="color-preview-btn btn-primary">Primary</button>
              <button className="color-preview-btn btn-secondary">Secondary</button>
              <button className="color-preview-btn btn-accent">Accent</button>
            </div>
          </div>

          <div className="color-preview-cards">
            <div className="color-preview-card">
              <h4>
                Card Title
                {!cardTitleContrastOk && (
                  <HoverTooltip
                    tooltipContent="Low contrast between card title and background! This may be hard to read."
                    className="contrast-warning-tooltip">
                    <span className="contrast-warning">⚠️</span>
                  </HoverTooltip>
                )}
              </h4>
              <p>This card uses UI background color</p>
            </div>
            <div className="color-preview-card">
              <h4>Another Card</h4>
              <p>See how your palette looks</p>
            </div>
          </div>
        </div>

        <div className="color-preview-footer">Footer with primary color</div>
      </div>
    </div>
  );
};
