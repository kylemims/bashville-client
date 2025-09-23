/**
 * Utility functions for parsing and handling interactive checkboxes in note content
 */

/**
 * Parse note content and extract checkbox information
 * Supports markdown-style checkboxes: - [ ] and - [x]
 * Returns array of checkbox objects and modified content
 */
export const parseCheckboxes = (content) => {
  console.log("🔍 Parsing checkboxes from content:", content);
  if (!content) return { checkboxes: [], parsedContent: content };

  const lines = content.split("\n");
  const checkboxes = [];

  const parsedLines = lines.map((line, index) => {
    // Match checkbox patterns: - [ ] or - [x] or * [ ] or * [x] (with optional spaces)
    const checkboxMatch = line.match(/^(\s*)[-*]\s*\[([ xX])\]\s*(.*)$/);

    if (checkboxMatch) {
      console.log("✅ Found checkbox:", checkboxMatch);
      const [, indent, checkState, text] = checkboxMatch;
      const isChecked = checkState.toLowerCase() === "x";

      checkboxes.push({
        id: `checkbox-${index}`,
        lineIndex: index,
        isChecked,
        text: text.trim(),
        indent: indent.length,
        originalLine: line,
      });

      // Return a placeholder that we'll replace with React component
      return `${indent}CHECKBOX_PLACEHOLDER_${index}`;
    }

    return line;
  });

  console.log("🔍 Checkbox parsing result:", { checkboxes, parsedContent: parsedLines.join("\n") });
  return {
    checkboxes,
    parsedContent: parsedLines.join("\n"),
  };
};

/**
 * Update checkbox state in content and return new content string
 */
export const updateCheckboxInContent = (content, checkboxIndex, isChecked) => {
  if (!content) return content;

  const lines = content.split("\n");
  const { checkboxes } = parseCheckboxes(content);

  const checkbox = checkboxes.find((cb) => cb.lineIndex === checkboxIndex);
  if (!checkbox) return content;

  // Reconstruct the line with updated checkbox state
  const indent = " ".repeat(checkbox.indent);
  const checkState = isChecked ? "x" : " ";
  const newLine = `${indent}- [${checkState}] ${checkbox.text}`;

  lines[checkboxIndex] = newLine;
  return lines.join("\n");
};

/**
 * Convert content with checkboxes to display format
 * Replaces checkbox markdown with visual indicators
 */
export const formatContentForDisplay = (content) => {
  if (!content) return content;

  return content.replace(/^(\s*)[-*]\s*\[([ xX])\]\s*(.*)$/gm, (match, indent, checkState, text) => {
    const isChecked = checkState.toLowerCase() === "x";
    const icon = isChecked ? "☑️" : "☐";
    return `${indent}${icon} ${text}`;
  });
};

/**
 * Count completed vs total checkboxes in content
 */
export const getCheckboxStats = (content) => {
  const { checkboxes } = parseCheckboxes(content);
  const completed = checkboxes.filter((cb) => cb.isChecked).length;
  const total = checkboxes.length;

  return { completed, total, hasCheckboxes: total > 0 };
};
