import { getBackendConfig } from "./backendConfig.js";

export const generateReadme = (project) => {
  const commands = project.commands_preview || [];
  const palette = project.color_palette_preview;
  const backend = getBackendConfig(project.id);

  let readme = `# ${project.title}\n\n`;

  if (project.description) {
    readme += `${project.description}\n\n`;
  }

  if (palette) {
    readme += `## 🎨 Color Palette: ${palette.name}\n\n`;
    readme += `| Color | Hex Code | Preview |\n`;
    readme += `|-------|----------|----------|\n`;
    readme += `| Primary | \`${
      palette.primary_hex
    }\` | ![](https://via.placeholder.com/20x20/${palette.primary_hex.slice(1)}/000000?text=+) |\n`;
    readme += `| Secondary | \`${
      palette.secondary_hex
    }\` | ![](https://via.placeholder.com/20x20/${palette.secondary_hex.slice(1)}/000000?text=+) |\n`;
    readme += `| Accent | \`${
      palette.accent_hex
    }\` | ![](https://via.placeholder.com/20x20/${palette.accent_hex.slice(1)}/000000?text=+) |\n`;
    readme += `| Background | \`${
      palette.background_hex
    }\` | ![](https://via.placeholder.com/20x20/${palette.background_hex.slice(1)}/000000?text=+) |\n`;

    if (palette.ui_hex) {
      readme += `| UI/Surface | \`${
        palette.ui_hex
      }\` | ![](https://via.placeholder.com/20x20/${palette.ui_hex.slice(1)}/000000?text=+) |\n`;
    }

    readme += `\n`;

    // Enhanced style preferences section
    if (palette.style_preferences && Object.keys(palette.style_preferences).length > 0) {
      const stylePrefs = palette.style_preferences;
      readme += `### 🎯 Style Preferences\n\n`;

      // Layout style
      if (stylePrefs.layout_style) {
        readme += `**Layout Style:** ${
          stylePrefs.layout_style.charAt(0).toUpperCase() + stylePrefs.layout_style.slice(1)
        }\n`;
      }

      // Border radius
      if (stylePrefs.card_radius || stylePrefs.button_radius || stylePrefs.hero_radius) {
        readme += `**Border Radius:**\n`;
        if (stylePrefs.card_radius) readme += `- Cards: ${stylePrefs.card_radius}\n`;
        if (stylePrefs.button_radius) readme += `- Buttons: ${stylePrefs.button_radius}\n`;
        if (stylePrefs.hero_radius) readme += `- Hero: ${stylePrefs.hero_radius}\n`;
      }

      // Hero customization
      if (stylePrefs.hero_background_type) {
        readme += `**Hero Section:**\n`;
        readme += `- Background: ${stylePrefs.hero_background_type}\n`;
        if (stylePrefs.hero_gradient_direction) {
          readme += `- Gradient Direction: ${stylePrefs.hero_gradient_direction}\n`;
        }
        if (stylePrefs.hero_background_color) {
          readme += `- Custom Color: ${stylePrefs.hero_background_color}\n`;
        }
      }

      // Feature cards
      let hasFeatureCustomizations = false;
      for (let i = 1; i <= 3; i++) {
        if (stylePrefs[`feature_${i}_bg`] || stylePrefs[`feature_${i}_style`]) {
          if (!hasFeatureCustomizations) {
            readme += `**Feature Cards:**\n`;
            hasFeatureCustomizations = true;
          }
          readme += `- Feature ${i}: `;
          if (stylePrefs[`feature_${i}_style`] && stylePrefs[`feature_${i}_style`] !== "default") {
            readme += `${stylePrefs[`feature_${i}_style`]} style`;
          }
          if (stylePrefs[`feature_${i}_bg`]) {
            readme += ` (custom background: ${stylePrefs[`feature_${i}_bg`]})`;
          }
          readme += `\n`;
        }
      }

      // Effects
      readme += `**Effects:**\n`;
      readme += `- Shadows: ${stylePrefs.shadows_enabled !== false ? "Enabled" : "Disabled"}\n`;
      readme += `- Animations: ${stylePrefs.animations_enabled !== false ? "Enabled" : "Disabled"}\n`;

      // Component overrides
      if (stylePrefs.component_overrides && Object.keys(stylePrefs.component_overrides).length > 0) {
        const overrideCount = Object.keys(stylePrefs.component_overrides).length;
        readme += `- Component Overrides: ${overrideCount} active\n`;
      }

      readme += `\n`;
    }

    readme += `### CSS Variables\n\n\`\`\`css\n`;
    readme += `:root {\n`;
    readme += `  --primary-color: ${palette.primary_hex};\n`;
    readme += `  --secondary-color: ${palette.secondary_hex};\n`;
    readme += `  --accent-color: ${palette.accent_hex};\n`;
    readme += `  --background-color: ${palette.background_hex};\n`;
    if (palette.ui_hex) {
      readme += `  --ui-color: ${palette.ui_hex};\n`;
    }

    // Add enhanced CSS variables from style preferences
    if (palette.style_preferences) {
      const stylePrefs = palette.style_preferences;

      if (stylePrefs.card_radius) {
        const radiusValue =
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
            : "8px";
        readme += `  --card-radius: ${radiusValue};\n`;
      }

      if (stylePrefs.button_radius) {
        const radiusValue =
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
            : "8px";
        readme += `  --button-radius: ${radiusValue};\n`;
      }

      if (stylePrefs.hero_background_type === "gradient") {
        const direction = stylePrefs.hero_gradient_direction || "135deg";
        readme += `  --hero-background: linear-gradient(${direction}, ${palette.primary_hex}, ${palette.secondary_hex});\n`;
      } else if (stylePrefs.hero_background_type === "solid") {
        const bgColor = stylePrefs.hero_background_color || palette.primary_hex;
        readme += `  --hero-background: ${bgColor};\n`;
      }

      // Feature card variables
      for (let i = 1; i <= 3; i++) {
        if (stylePrefs[`feature_${i}_bg`]) {
          readme += `  --feature-${i}-bg: ${stylePrefs[`feature_${i}_bg`]};\n`;
        }
        if (stylePrefs[`feature_${i}_text`]) {
          readme += `  --feature-${i}-text: ${stylePrefs[`feature_${i}_text`]};\n`;
        }
        if (stylePrefs[`feature_${i}_accent`]) {
          readme += `  --feature-${i}-accent: ${stylePrefs[`feature_${i}_accent`]};\n`;
        }
      }
    }

    readme += `}\n\`\`\`\n\n`;
  }

  if (backend && (backend.models?.length || backend.relationships?.length)) {
    readme += `## 🧩 Backend Schema (Preview)\n\n`;
    readme += `This reflects your selections in the **Backend** tab. You can pipe this into your generator later.\n\n`;
    readme += "```json\n";
    readme += JSON.stringify(backend, null, 2);
    readme += "\n```\n\n";
  }

  // Enhanced project info based on project type
  if (project.project_type && project.project_type !== "custom") {
    readme += `## �️ Project Structure\n\n`;

    switch (project.project_type) {
      case "react-css":
        readme += `This is a **React + CSS** project with:\n`;
        readme += `- Modern React components with functional architecture\n`;
        readme += `- CSS custom properties for theming\n`;
        readme += `- Responsive design with mobile-first approach\n`;
        readme += `- Component-scoped styling\n\n`;

        readme += `### 🎨 Styling Architecture\n`;
        readme += `- **CSS Variables**: Centralized color management in \`:root\`\n`;
        readme += `- **Component CSS**: Each component has its own stylesheet\n`;
        readme += `- **Responsive Utilities**: Mobile-first breakpoints\n`;
        readme += `- **Design System**: Consistent spacing and typography\n\n`;
        break;

      case "react-tailwind":
        readme += `This is a **React + Tailwind CSS** project with:\n`;
        readme += `- Utility-first CSS framework\n`;
        readme += `- Custom Tailwind configuration\n`;
        readme += `- JIT (Just-In-Time) compilation\n`;
        readme += `- Custom color palette integration\n\n`;

        readme += `### 🎨 Tailwind Configuration\n`;
        readme += `Custom colors are defined in \`tailwind.config.js\`:\n`;
        readme += `\`\`\`javascript\n`;
        readme += `theme: {\n`;
        readme += `  extend: {\n`;
        readme += `    colors: {\n`;
        if (palette) {
          readme += `      primary: '${palette.primary_hex}',\n`;
          readme += `      secondary: '${palette.secondary_hex}',\n`;
          readme += `      accent: '${palette.accent_hex}',\n`;
          readme += `      background: '${palette.background_hex}'\n`;
        }
        readme += `    }\n`;
        readme += `  }\n`;
        readme += `}\n`;
        readme += `\`\`\`\n\n`;
        break;

      case "django-react-css":
        readme += `This is a **Django + React + CSS** full-stack project with:\n`;
        readme += `- Django REST API backend\n`;
        readme += `- React frontend with CSS styling\n`;
        readme += `- Token-based authentication\n`;
        readme += `- Separated concerns architecture\n\n`;

        readme += `### 🏗️ Architecture Overview\n`;
        readme += `- **Backend**: Django REST Framework API\n`;
        readme += `- **Frontend**: React SPA with CSS modules\n`;
        readme += `- **Database**: SQLite (development) / PostgreSQL (production)\n`;
        readme += `- **Authentication**: JWT token-based\n\n`;
        break;

      case "django-react-tailwind":
        readme += `This is a **Django + React + Tailwind** full-stack project with:\n`;
        readme += `- Django REST API backend\n`;
        readme += `- React frontend with Tailwind CSS\n`;
        readme += `- Modern utility-first styling\n`;
        readme += `- Full-stack integration\n\n`;

        readme += `### 🏗️ Full-Stack Architecture\n`;
        readme += `- **Backend**: Django REST Framework with CORS\n`;
        readme += `- **Frontend**: React with Tailwind CSS\n`;
        readme += `- **Styling**: Utility-first with custom design system\n`;
        readme += `- **API**: RESTful endpoints with serializers\n\n`;
        break;

      default:
        readme += `This is a custom project with:\n`;
        readme += `- Modern web development practices\n`;
        readme += `- Responsive design\n`;
        readme += `- Clean architecture\n\n`;
        break;
    }
  }

  // Development and setup information
  readme += `## 🚀 Quick Start\n\n`;

  if (project.project_type && project.project_type.includes("django")) {
    readme += `### Backend Setup\n`;
    readme += `\`\`\`bash\n`;
    readme += `# Create virtual environment\n`;
    readme += `python -m venv venv\n`;
    readme += `source venv/bin/activate  # On Windows: venv\\Scripts\\activate\n\n`;
    readme += `# Install dependencies\n`;
    readme += `pip install -r requirements.txt\n\n`;
    readme += `# Run migrations\n`;
    readme += `python manage.py migrate\n\n`;
    readme += `# Create superuser (optional)\n`;
    readme += `python manage.py createsuperuser\n\n`;
    readme += `# Start development server\n`;
    readme += `python manage.py runserver\n`;
    readme += `\`\`\`\n\n`;

    readme += `### Frontend Setup\n`;
  } else {
    readme += `### Installation\n`;
  }

  readme += `\`\`\`bash\n`;
  readme += `# Install dependencies\n`;
  readme += `npm install\n\n`;
  readme += `# Start development server\n`;
  readme += `npm start\n\n`;
  readme += `# Build for production\n`;
  readme += `npm run build\n`;
  readme += `\`\`\`\n\n`;

  readme += `## 📁 Project Structure\n\n`;
  readme += `\`\`\`\n`;

  if (project.project_type && project.project_type.includes("django")) {
    readme += `${project.title.toLowerCase().replace(/\s+/g, "_")}/\n`;
    readme += `├── backend/\n`;
    readme += `│   ├── manage.py\n`;
    readme += `│   ├── requirements.txt\n`;
    readme += `│   ├── ${project.title.toLowerCase().replace(/\s+/g, "_")}/\n`;
    readme += `│   │   ├── settings.py\n`;
    readme += `│   │   ├── urls.py\n`;
    readme += `│   │   └── wsgi.py\n`;
    readme += `│   └── api/\n`;
    readme += `│       ├── models.py\n`;
    readme += `│       ├── serializers.py\n`;
    readme += `│       ├── views.py\n`;
    readme += `│       └── urls.py\n`;
    readme += `└── frontend/\n`;
    readme += `    ├── public/\n`;
    readme += `    ├── src/\n`;
    readme += `    │   ├── components/\n`;
    readme += `    │   ├── pages/\n`;
    readme += `    │   ├── services/\n`;
    readme += `    │   └── App.js\n`;
    readme += `    ├── package.json\n`;
    if (project.project_type.includes("tailwind")) {
      readme += `    └── tailwind.config.js\n`;
    }
  } else {
    readme += `${project.title.toLowerCase().replace(/\s+/g, "-")}/\n`;
    readme += `├── public/\n`;
    readme += `│   ├── index.html\n`;
    readme += `│   └── assets/\n`;
    readme += `├── src/\n`;
    readme += `│   ├── components/\n`;
    readme += `│   ├── pages/\n`;
    readme += `│   ├── styles/\n`;
    readme += `│   └── App.js\n`;
    readme += `├── package.json\n`;
    if (project.project_type === "react-tailwind") {
      readme += `└── tailwind.config.js\n`;
    }
  }

  readme += `\`\`\`\n\n`;
  if (commands.length > 0) {
    readme += `## 📋 Commands\n\n`;
    commands.forEach((cmd, index) => {
      readme += `### ${index + 1}. ${cmd.label}\n\n`;
      readme += `\`\`\`bash\n${cmd.command_text}\n\`\`\`\n\n`;
    });
  }

  readme += `---\n\n`;
  readme += `*Generated by Bash Stash on ${new Date().toLocaleDateString()}*\n`;

  return readme;
};
