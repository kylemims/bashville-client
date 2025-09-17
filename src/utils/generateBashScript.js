import { getBackendConfig } from "./backendConfig";
import { generateStyleCSS, generateIconComponent } from "./styleConstants.js";

export const generateBashScript = (project) => {
  const commands = project.commands_preview || [];
  const palette = project.color_palette_preview;
  const backend = getBackendConfig(project.id);

  let script = `#!/bin/bash
# ${project.title} - Auto-generated setup script
# Generated on ${new Date().toISOString().split("T")[0]}
#
# How to run:
#   chmod +x setup.sh
#   ./setup.sh
#
# Notes:
# - Safe-by-default: we only create files if they don't exist.
# - You can edit this file before running if you want.

set -euo pipefail

# --- helpers ---------------------------------------------------------------
confirm() {
  # Usage: confirm "Message"; returns 0 for yes, 1 for no
  read -r -p "$1 [y/N] " ans || true
  case "\${ans}" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

# --- .gitignore (mix of Python/Node/editor) -------------------------------
echo "==> Ensuring a useful .gitignore is present…"
if [ ! -f ".gitignore" ]; then
  # Prefer GitHub template for Python; then add a few extras
  if command -v curl >/dev/null 2>&1; then
    curl -Ls 'https://raw.githubusercontent.com/github/gitignore/master/Python.gitignore' > .gitignore || true
  fi
  # Append extras; duplicates are fine
  cat >> .gitignore <<'EOF_GI'
db.sqlite3
.env
node_modules/
dist/
.vscode/
.DS_Store
__pycache__/
*.pyc
EOF_GI
  echo "✓ wrote .gitignore"
else
  echo "• .gitignore already exists; leaving it untouched."
fi

`;

  if (project.description) {
    script += `# Description: ${project.description}\n\n`;
  }

  if (palette) {
    // Determine project type based on available data
    const projectType = project.project_type || "react-css"; // default to react-css

    script += `# Color Variables from "${palette.name}" palette
export PRIMARY_COLOR="${palette.primary_hex}"
export SECONDARY_COLOR="${palette.secondary_hex}"
export ACCENT_COLOR="${palette.accent_hex}"
export BACKGROUND_COLOR="${palette.background_hex}"
export UI_COLOR="${palette.ui_hex || "#ffffff"}"

# Generate enhanced styles with advanced preferences
mkdir -p styles
`;

    // Generate enhanced CSS with style preferences
    if (palette.style_preferences && Object.keys(palette.style_preferences).length > 0) {
      const enhancedCSS = generateStyleCSS(palette, projectType);

      if (projectType.includes("tailwind")) {
        script += `cat > tailwind.config.js <<'TAILWINDCONFIG'
${JSON.stringify(enhancedCSS, null, 2)}
TAILWINDCONFIG

`;
      } else {
        script += `cat > styles/enhanced.css <<'ENHANCEDCSS'
${typeof enhancedCSS === "string" ? enhancedCSS : "/* Enhanced styles generated */"}
ENHANCEDCSS

`;
      }
    }

    // Basic CSS fallback
    script += `cat > styles/colors.css <<'CSSVARS'
:root {
  --primary-color: ${palette.primary_hex};
  --secondary-color: ${palette.secondary_hex};
  --accent-color: ${palette.accent_hex};
  --background-color: ${palette.background_hex};
  --ui-color: ${palette.ui_hex || "#ffffff"};
  
  /* Enhanced style preferences */`;

    if (palette.style_preferences) {
      const stylePrefs = palette.style_preferences;

      // Layout style variables
      if (stylePrefs.layout_style) {
        script += `
  --layout-style: ${stylePrefs.layout_style};`;
      }

      // Border radius variables
      if (stylePrefs.card_radius) {
        script += `
  --card-radius: ${
    stylePrefs.card_radius === "none"
      ? "0px"
      : stylePrefs.card_radius === "small"
      ? "4px"
      : stylePrefs.card_radius === "medium"
      ? "8px"
      : stylePrefs.card_radius === "large"
      ? "12px"
      : stylePrefs.card_radius === "xl"
      ? "16px"
      : stylePrefs.card_radius === "full"
      ? "9999px"
      : "8px"
  };`;
      }

      if (stylePrefs.button_radius) {
        script += `
  --button-radius: ${
    stylePrefs.button_radius === "none"
      ? "0px"
      : stylePrefs.button_radius === "small"
      ? "4px"
      : stylePrefs.button_radius === "medium"
      ? "8px"
      : stylePrefs.button_radius === "large"
      ? "12px"
      : stylePrefs.button_radius === "xl"
      ? "16px"
      : stylePrefs.button_radius === "full"
      ? "9999px"
      : "8px"
  };`;
      }

      if (stylePrefs.hero_radius) {
        script += `
  --hero-radius: ${
    stylePrefs.hero_radius === "none"
      ? "0px"
      : stylePrefs.hero_radius === "small"
      ? "4px"
      : stylePrefs.hero_radius === "medium"
      ? "8px"
      : stylePrefs.hero_radius === "large"
      ? "12px"
      : stylePrefs.hero_radius === "xl"
      ? "16px"
      : stylePrefs.hero_radius === "full"
      ? "9999px"
      : "0px"
  };`;
      }

      // Hero background
      if (stylePrefs.hero_background_type) {
        const heroType = stylePrefs.hero_background_type;
        if (heroType === "gradient") {
          const direction = stylePrefs.hero_gradient_direction || "135deg";
          script += `
  --hero-background: linear-gradient(${direction}, ${palette.primary_hex}, ${palette.secondary_hex});`;
        } else if (heroType === "solid") {
          const bgColor = stylePrefs.hero_background_color || palette.primary_hex;
          script += `
  --hero-background: ${bgColor};`;
        } else if (heroType === "transparent") {
          script += `
  --hero-background: transparent;`;
        }
      }

      // Feature card variables
      for (let i = 1; i <= 3; i++) {
        if (stylePrefs[`feature_${i}_bg`]) {
          script += `
  --feature-${i}-bg: ${stylePrefs[`feature_${i}_bg`]};`;
        }
        if (stylePrefs[`feature_${i}_text`]) {
          script += `
  --feature-${i}-text: ${stylePrefs[`feature_${i}_text`]};`;
        }
        if (stylePrefs[`feature_${i}_accent`]) {
          script += `
  --feature-${i}-accent: ${stylePrefs[`feature_${i}_accent`]};`;
        }
      }

      // Effects
      script += `
  --shadows-enabled: ${stylePrefs.shadows_enabled !== false ? "1" : "0"};
  --animations-enabled: ${stylePrefs.animations_enabled !== false ? "1" : "0"};`;
    }

    script += `
}

/* Component-specific styles based on advanced preferences */
.hero-section {
  background: var(--hero-background);
  border-radius: var(--hero-radius);
}

.card {
  border-radius: var(--card-radius);
  box-shadow: var(--shadows-enabled) == '1' ? 0 2px 8px rgba(0,0,0,0.1) : none;
}

.button {
  border-radius: var(--button-radius);
  box-shadow: var(--shadows-enabled) == '1' ? 0 1px 3px rgba(0,0,0,0.1) : none;
}

/* Feature cards */
.feature-card-1 {
  background-color: var(--feature-1-bg, var(--ui-color));
  color: var(--feature-1-text, #1f2937);
}

.feature-card-2 {
  background-color: var(--feature-2-bg, var(--ui-color));
  color: var(--feature-2-text, #1f2937);
}

.feature-card-3 {
  background-color: var(--feature-3-bg, var(--ui-color));
  color: var(--feature-3-text, #1f2937);
}

.feature-accent-1 { background-color: var(--feature-1-accent, var(--accent-color)); }
.feature-accent-2 { background-color: var(--feature-2-accent, var(--primary-color)); }
.feature-accent-3 { background-color: var(--feature-3-accent, var(--secondary-color)); }
CSSVARS

# Create component style guide
cat > styles/component-guide.md <<'GUIDE'
# ${palette.name} Style Guide

## Color Palette
- Primary: ${palette.primary_hex}
- Secondary: ${palette.secondary_hex}  
- Accent: ${palette.accent_hex}
- Background: ${palette.background_hex}
- UI/Surface: ${palette.ui_hex || "#ffffff"}

## Layout Style
${
  palette.style_preferences?.layout_style
    ? `Layout: ${
        palette.style_preferences.layout_style.charAt(0).toUpperCase() +
        palette.style_preferences.layout_style.slice(1)
      }`
    : "Layout: Modern (default)"
}

## Border Radius
${
  palette.style_preferences?.card_radius
    ? `Cards: ${palette.style_preferences.card_radius}`
    : "Cards: medium (default)"
}
${
  palette.style_preferences?.button_radius
    ? `Buttons: ${palette.style_preferences.button_radius}`
    : "Buttons: medium (default)"
}
${
  palette.style_preferences?.hero_radius
    ? `Hero: ${palette.style_preferences.hero_radius}`
    : "Hero: none (default)"
}

## Hero Section
${
  palette.style_preferences?.hero_background_type
    ? `Background: ${palette.style_preferences.hero_background_type}`
    : "Background: gradient (default)"
}
${
  palette.style_preferences?.hero_gradient_direction
    ? `Gradient Direction: ${palette.style_preferences.hero_gradient_direction}`
    : ""
}

## Effects
${palette.style_preferences?.shadows_enabled !== false ? "✅ Shadows enabled" : "❌ Shadows disabled"}
${
  palette.style_preferences?.animations_enabled !== false ? "✅ Animations enabled" : "❌ Animations disabled"
}

## Usage
Include \`styles/colors.css\` in your project to use these design tokens.
For enhanced features, also include \`styles/enhanced.css\`.
GUIDE

`;
  }

  // Add Material Icons and Smart Icon Library
  script += `
# === Material Icons & Smart Icon Library ===
echo "==> Setting up Material Icons and Smart Icon Library..."

# Create components directory if it doesn't exist
mkdir -p components

# Add Material Icons to HTML (if index.html exists)
if [ -f "index.html" ]; then
  if ! grep -q "material-symbols-outlined" index.html; then
    # Add Material Icons to the head section
    sed -i.bak '/<\\/head>/i\\
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
' index.html
    echo "✓ Added Material Icons to index.html"
  else
    echo "• Material Icons already present in index.html"
  fi
else
  echo "• index.html not found, Material Icons can be added manually"
fi

# Generate MaterialIcon component
cat > components/MaterialIcon.jsx <<'MATERIALICON'
export const MaterialIcon = ({
  icon,
  className = "",
  size = 24,
  color = "inherit",
  filled = false,
  weight = 400,
  ...props
}) => {
  const style = {
    fontSize: \`\${size}px\`,
    color: color,
    fontVariationSettings: \`
      'FILL' \${filled ? 1 : 0},
      'wght' \${weight},
      'GRAD' 0,
      'opsz' \${size}
    \`,
  };

  return (
    <span className={\`material-symbols-outlined \${className}\`} style={style} {...props}>
      {icon}
    </span>
  );
};
MATERIALICON

# Generate Smart Icon Library
cat > components/AppIcons.jsx <<'APPICONS'
${generateIconComponent()}
APPICONS

echo "✓ Created MaterialIcon component at components/MaterialIcon.jsx"
echo "✓ Created Smart Icon Library at components/AppIcons.jsx"
echo ""
echo "📖 Usage Examples:"
echo "   import { AppIcons } from './components/AppIcons';"
echo "   <button><AppIcons.edit /> Edit Profile</button>"
echo "   <nav><AppIcons.menu size={24} /></nav>"
echo "   <AppIcons.cart color=\\"primary\\" />"
echo ""

`;

  if (backend && (backend.models?.length || backend.relationships?.length)) {
    script += `# Backend Schema (preview)
# This mirrors your Backend tab selections for reference.
cat > backend_schema.json <<'JSON'
${JSON.stringify(backend, null, 2)}
JSON

`;
  }

  if (commands.length > 0) {
    script += `# Project Commands
echo "🚀 Setting up ${project.title}..."

`;
    commands.forEach((cmd, index) => {
      const label = (cmd.label || `Step ${index + 1}`).replace(/\n/g, " ");
      script += `# ${label}
echo "Step ${index + 1}: ${label}"
${cmd.command_text}

`;
    });
    script += `echo "✅ ${project.title} setup complete!"
`;
  } else {
    script += `echo "ℹ️  ${project.title}: no project commands were configured yet."
`;
  }

  return script;
};
