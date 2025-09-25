import React, { useState, useRef, useEffect } from "react";
import { BaseBlock } from "./BaseBlock.jsx";
import "./TextBlock.css";

export function TextBlock({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content || "");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content, isEditing]);

  const handleSave = () => {
    if (content.trim() !== block.content) {
      onUpdate(block.id, { content: content.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === "Escape") {
      setContent(block.content || "");
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
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
        <div className="text-block-edit">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="text-block-textarea"
            placeholder="Enter your text..."
            rows={1}
          />
          <div className="text-block-hint">
            <span>⌘/Ctrl + Enter to save • Esc to cancel</span>
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
      <div
        className={`text-block-display ${!block.content ? "text-block-empty" : ""}`}
        onClick={startEditing}>
        {block.content || "Click to add text..."}
      </div>
    </BaseBlock>
  );
}
