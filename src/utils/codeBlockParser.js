/**
 * Utility functions for parsing and handling code blocks in note content
 */

/**
 * Parse note content and extract code block information
 * Supports fenced code blocks with ``` and language hints
 */
export const parseCodeBlocks = (content) => {
  if (!content) return { codeBlocks: [], parsedContent: content };

  const lines = content.split("\n");
  const codeBlocks = [];
  let inCodeBlock = false;
  let currentBlock = null;
  let blockIndex = 0;

  const parsedLines = lines.map((line, index) => {
    // Check for code block start
    const codeStartMatch = line.match(/^(\s*)```(\w*)\s*$/);
    if (codeStartMatch && !inCodeBlock) {
      const [, indent, language] = codeStartMatch;
      currentBlock = {
        id: `code-${blockIndex}`,
        startLine: index,
        endLine: -1,
        language: language || "text",
        content: [],
        indent: indent.length,
      };
      inCodeBlock = true;
      return `${indent}CODE_BLOCK_START_${blockIndex}`;
    }

    // Check for code block end
    if (line.match(/^(\s*)```\s*$/) && inCodeBlock && currentBlock) {
      currentBlock.endLine = index;
      codeBlocks.push(currentBlock);
      inCodeBlock = false;
      const result = `${" ".repeat(currentBlock.indent)}CODE_BLOCK_END_${blockIndex}`;
      currentBlock = null;
      blockIndex++;
      return result;
    }

    // Inside code block
    if (inCodeBlock && currentBlock) {
      currentBlock.content.push(line);
      return `CODE_BLOCK_CONTENT_${blockIndex}_${currentBlock.content.length - 1}`;
    }

    // Regular line
    return line;
  });

  return {
    codeBlocks,
    parsedContent: parsedLines.join("\n"),
  };
};

/**
 * Extract inline code snippets (surrounded by backticks)
 */
export const parseInlineCode = (content) => {
  if (!content) return content;

  // Replace inline code with placeholders for rendering
  return content.replace(/`([^`]+)`/g, (match, code) => {
    return `INLINE_CODE:${btoa(code)}`;
  });
};

/**
 * Detect if content has code blocks or inline code
 */
export const hasCodeContent = (content) => {
  if (!content) return false;

  // Check for fenced code blocks
  const hasCodeBlocks = /```[\s\S]*?```/g.test(content);

  // Check for inline code
  const hasInlineCode = /`[^`]+`/g.test(content);

  return hasCodeBlocks || hasInlineCode;
};

/**
 * Get supported languages for syntax highlighting
 */
export const getSupportedLanguages = () => {
  return [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "csharp",
    "php",
    "ruby",
    "go",
    "rust",
    "kotlin",
    "swift",
    "html",
    "css",
    "scss",
    "sass",
    "json",
    "xml",
    "yaml",
    "sql",
    "bash",
    "shell",
    "powershell",
    "dockerfile",
    "markdown",
    "jsx",
    "tsx",
    "vue",
    "svelte",
  ];
};

/**
 * Normalize language name for syntax highlighter
 */
export const normalizeLanguage = (lang) => {
  if (!lang) return "text";

  const normalized = lang.toLowerCase();
  const languageMap = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    yml: "yaml",
    md: "markdown",
    htm: "html",
  };

  return languageMap[normalized] || normalized;
};
