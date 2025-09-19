import { getBestTextColor } from "./colorUtils.js";

/**
 * Semantic Color Mapping Utilities
 *
 * This module provides the correct semantic mapping for color usage,
 * fixing the confusion where 'background_hex' was being used for hero text
 * and 'ui_hex' was controlling page background.
 */

/**
 * Get semantic colors with proper mappings
 * @param {Object} formData - The color palette form data
 * @returns {Object} Semantic color mapping
 */
export const getSemanticColors = (formData) => {
  if (!formData) return {};

  return {
    // Page-level colors (FIXED MAPPING)
    page_background: formData.background_hex || "#ffffff",
    content_background: formData.background_hex || "#ffffff",

    // Navigation colors (FIXED MAPPING)
    navigation_background: formData.ui_hex || "#1f2937",
    navigation_text: getBestTextColor(formData.ui_hex || "#1f2937"),

    // Hero section colors
    hero_background: formData.primary_hex || "#3b82f6",
    hero_text: getBestTextColor(formData.primary_hex || "#3b82f6"),

    // Button colors
    primary_button: formData.primary_hex || "#3b82f6",
    primary_button_text: getBestTextColor(formData.primary_hex || "#3b82f6"),
    secondary_button: formData.secondary_hex || "#6b7280",
    secondary_button_text: getBestTextColor(formData.secondary_hex || "#6b7280"),
    accent_button: formData.accent_hex || "#10b981",
    accent_button_text: getBestTextColor(formData.accent_hex || "#10b981"),

    // Content colors
    content_text: getBestTextColor(formData.background_hex || "#ffffff"),
    content_text_muted: formData.background_hex === "#ffffff" ? "#6b7280" : "#9ca3af",

    // Border and subtle elements
    border_color: formData.background_hex === "#ffffff" ? "#e5e7eb" : "#374151",
    card_background: formData.ui_hex || "#ffffff",
    card_text: getBestTextColor(formData.ui_hex || "#ffffff"),
  };
};

/**
 * Get component-specific color with overrides
 * @param {string} componentType - Type of component (hero, navigation, etc.)
 * @param {string} colorType - Type of color (background_color, text_color, etc.)
 * @param {string} defaultColor - Fallback color
 * @param {Object} stylePreferences - Style preferences with overrides
 * @param {Object} semanticColors - Semantic color mapping
 * @returns {string} The resolved color
 */
export const getComponentColor = (
  componentType,
  colorType,
  defaultColor,
  stylePreferences = {},
  semanticColors = {}
) => {
  // Check for component-specific overrides first
  const overrides = stylePreferences?.component_overrides || {};
  const componentOverride = overrides[componentType];

  if (componentOverride && componentOverride[colorType]) {
    return componentOverride[colorType];
  }

  // Use semantic color mapping if available
  const semanticKey = `${componentType}_${colorType.replace("_color", "")}`;
  if (semanticColors[semanticKey]) {
    return semanticColors[semanticKey];
  }

  // Fallback to default
  return defaultColor;
};

/**
 * Get hero button colors with proper contrast
 * @param {string} buttonType - primary, secondary, accent
 * @param {string} colorType - background_color or text_color
 * @param {Object} formData - Color palette form data
 * @param {Object} stylePreferences - Style preferences
 * @returns {string} The resolved color
 */
export const getHeroButtonColor = (buttonType, colorType, formData, stylePreferences = {}) => {
  const semanticColors = getSemanticColors(formData);

  // Check for hero button overrides
  const overrides = stylePreferences?.component_overrides || {};
  const heroButtonOverrides = overrides["hero_buttons"];

  if (heroButtonOverrides && heroButtonOverrides[buttonType]) {
    const overrideColor = heroButtonOverrides[buttonType];

    if (colorType === "text_color") {
      return getBestTextColor(overrideColor);
    }
    return overrideColor;
  }

  // Use semantic mapping
  const semanticKey = `${buttonType}_button${colorType === "text_color" ? "_text" : ""}`;
  return semanticColors[semanticKey] || semanticColors[`${buttonType}_button`] || formData.primary_hex;
};

/**
 * Sanitize color value for inputs
 * @param {string} value - Color value to sanitize
 * @returns {string} Sanitized color value
 */
export const sanitizeColorValue = (value) => {
  if (!value) return "#3b82f6";
  if (typeof value !== "string") return "#3b82f6";
  if (value.startsWith("#") && value.length >= 4) return value;
  return "#3b82f6";
};

/**
 * Generate color variants (lighter/darker versions)
 * @param {string} baseColor - Base hex color
 * @param {number} lightnessDelta - How much to adjust lightness (-100 to 100)
 * @returns {string} Adjusted hex color
 */
export const generateColorVariant = (baseColor, lightnessDelta) => {
  // Simple HSL adjustment - can be enhanced later
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Convert to HSL, adjust lightness, convert back
  // For now, simple RGB adjustment
  const factor = lightnessDelta > 0 ? (255 - Math.max(r, g, b)) / 255 : Math.min(r, g, b) / 255;
  const adjust = Math.abs(lightnessDelta) * factor;

  const newR = Math.max(0, Math.min(255, lightnessDelta > 0 ? r + adjust : r - adjust));
  const newG = Math.max(0, Math.min(255, lightnessDelta > 0 ? g + adjust : g - adjust));
  const newB = Math.max(0, Math.min(255, lightnessDelta > 0 ? b + adjust : b - adjust));

  return `#${Math.round(newR).toString(16).padStart(2, "0")}${Math.round(newG)
    .toString(16)
    .padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`;
};
