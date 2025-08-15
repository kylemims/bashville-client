/**
 * Generates a bash setup script from project data
 * @param {Object} project - Project object with commands and palette
 * @returns {string} - Generated bash script content
 */

export const generateBashScript = (project) => {
  const commands = project.commands_preview || [];
  const palette = project.color_palette_preview;

  let script = `#!/bin/bash\n# ${project.title} - Auto-generated setup script\n# Generated on ${
    new Date().toISOString().split("T")[0]
  }\n\n`;

  if (project.description) {
    script += `# Description: ${project.description}\n\n`;
  }

  // Add color variables if palette exists
  if (palette) {
    script += `# Color Variables from "${palette.name}" palette\n`;
    script += `export PRIMARY_COLOR="${palette.primary_hex}"\n`;
    script += `export SECONDARY_COLOR="${palette.secondary_hex}"\n`;
    script += `export ACCENT_COLOR="${palette.accent_hex}"\n`;
    script += `export BACKGROUND_COLOR="${palette.background_hex}"\n\n`;
  }

  // Add commands
  if (commands.length > 0) {
    script += `# Project Commands\necho "🚀 Setting up ${project.title}..."\n\n`;
    commands.forEach((cmd, index) => {
      script += `# ${cmd.label}\necho "Step ${index + 1}: ${cmd.label}"\n${cmd.command_text}\n\n`;
    });
    script += `echo "✅ ${project.title} setup complete!"\n`;
  } else {
    script += `echo "🚀 ${project.title} - No commands configured yet"\n`;
  }

  return script;
};
