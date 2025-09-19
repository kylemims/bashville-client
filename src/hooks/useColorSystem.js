import { useMemo } from "react";
import { getSemanticColors, getComponentColor, getHeroButtonColor } from "../utils/colorMappingUtils.js";
import { isContrastAccessible } from "../utils/colorUtils.js";
import { BORDER_RADIUS } from "../utils/styleConstants.js";

/**
 * Custom hook for managing color state and providing semantic color access
 * This centralizes color logic and provides a clean API for components
 */
export const useColorSystem = (formData, stylePreferences = {}) => {
  // Memoize semantic colors to avoid recalculation on every render
  const semanticColors = useMemo(() => {
    return getSemanticColors(formData);
  }, [formData]);

  // Helper functions that use the semantic colors
  const colorHelpers = useMemo(() => {
    return {
      // Get component color with semantic mapping and overrides
      getColor: (componentType, colorType, fallback) => {
        return getComponentColor(componentType, colorType, fallback, stylePreferences, semanticColors);
      },

      // Get hero button colors with proper contrast
      getHeroButton: (buttonType, colorType) => {
        return getHeroButtonColor(buttonType, colorType, formData, stylePreferences);
      },

      // Get feature-specific colors (for backwards compatibility)
      getFeatureColor: (featureId, colorType, defaultColor) => {
        const featureKey = `feature_${featureId}_${colorType}`;
        return stylePreferences?.[featureKey] || defaultColor;
      },

      // Check if a color combination has sufficient contrast
      hasGoodContrast: (foreground, background) => {
        return isContrastAccessible(foreground, background);
      },

      // Get theme-appropriate shadows and borders
      getThemeShadow: (elementType = "default") => {
        // Check if shadows are enabled
        if (stylePreferences?.shadows_enabled === false) {
          return "none";
        }

        const isDark = semanticColors.page_background !== "#ffffff";
        const shadows = {
          default: isDark ? "0 1px 3px rgba(255, 255, 255, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
          card: isDark ? "0 4px 6px rgba(255, 255, 255, 0.1)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
          hero: isDark ? "0 10px 25px rgba(255, 255, 255, 0.1)" : "0 10px 25px rgba(0, 0, 0, 0.1)",
          button: isDark ? "0 2px 4px rgba(255, 255, 255, 0.1)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
        };
        return shadows[elementType] || shadows.default;
      },

      // Get element border radius from style preferences
      getElementRadius: (elementType = "default") => {
        let borderStyle = "medium"; // default fallback

        // Map element types to specific style preference keys
        switch (elementType) {
          case "card":
            borderStyle = stylePreferences?.card_radius || "medium";
            break;
          case "button":
            borderStyle = stylePreferences?.button_radius || "medium";
            break;
          case "hero":
            borderStyle = stylePreferences?.hero_radius || "none";
            break;
          default:
            borderStyle = stylePreferences?.border_radius || stylePreferences?.card_radius || "medium";
        }

        const radiusConfig = BORDER_RADIUS[borderStyle];

        if (!radiusConfig) {
          return BORDER_RADIUS.medium.css;
        }

        // Use CSS value since the new structure is simplified
        return radiusConfig.css;
      },
    };
  }, [formData, stylePreferences, semanticColors]);

  return {
    semanticColors,
    ...colorHelpers,
  };
};
