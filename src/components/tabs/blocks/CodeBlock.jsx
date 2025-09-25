import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BaseBlock } from "./BaseBlock.jsx";
import { MaterialIcon } from "../../common/MaterialIcon.jsx";
import { normalizeLanguage } from "../../../utils/codeBlockParser.js";
import "./CodeBlock.css";

export function CodeBlock({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content || "");
  const [language, setLanguage] = useState(block.language || "javascript");

  const languages = [
    "javascript",
    "python",
    "typescript",
    "html",
    "css",
    "json",
    "bash",
    "sql",
    "java",
    "php",
    "go",
    "rust",
    "cpp",
    "markdown",
  ];

  const handleSave = () => {
    if (content.trim() !== block.content || language !== block.language) {
      onUpdate(block.id, {
        content: content.trim(),
        language: language,
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newContent = content.substring(0, start) + "  " + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    } else if (e.key === "Escape") {
      setContent(block.content || "");
      setLanguage(block.language || "javascript");
      setIsEditing(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(block.content || "");
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <BaseBlock
        block={block}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}>
        <div className="code-block-edit">
          <div className="code-block-header">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="code-language-select">
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <button type="button" className="code-save-btn" onClick={handleSave} title="Save code">
              <MaterialIcon icon="check" size={16} />
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="code-block-textarea"
            placeholder="Enter your code..."
            spellCheck={false}
          />
          <div className="code-block-hint">
            <span>Tab for indent • Esc to cancel</span>
          </div>
        </div>
      </BaseBlock>
    );
  }

  return (
    <BaseBlock
      block={block}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      isFirst={isFirst}
      isLast={isLast}>
      <div className="code-block-display">
        <div className="code-block-header">
          <span className="code-language-label">{block.language || "code"}</span>
          <div className="code-block-actions">
            <button type="button" className="code-copy-btn" onClick={copyCode} title="Copy code">
              <MaterialIcon icon="content_copy" size={14} />
            </button>
            <button type="button" className="code-edit-btn" onClick={startEditing} title="Edit code">
              <MaterialIcon icon="edit" size={14} />
            </button>
          </div>
        </div>
        {block.content && block.content.trim() ? (
          <div className="code-content">
            <SyntaxHighlighter
              language={normalizeLanguage(block.language) || "javascript"}
              style={tomorrow}
              showLineNumbers={true}
              wrapLines={true}
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: "13px",
                lineHeight: "1.5",
                borderRadius: 0,
                border: "none",
              }}
              codeTagProps={{
                style: {
                  fontFamily: '"Fira Code", "SF Mono", Monaco, Consolas, monospace',
                  padding: "12px",
                },
              }}>
              {block.content}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div className="code-content code-placeholder">
            <span style={{ color: "var(--muted)", fontStyle: "italic", padding: "12px", display: "block" }}>
              Click edit to add code...
            </span>
          </div>
        )}
      </div>
    </BaseBlock>
  );
}
