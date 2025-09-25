import React, { useState } from "react";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import "./NoteMigrationHelper.css";

export function NoteMigrationHelper({ note, onMigrate }) {
  const [isConverting, setIsConverting] = useState(false);

  // Check if note needs migration (has content but no blocks)
  const needsMigration = note.content && (!note.blocks || note.blocks.length === 0);

  if (!needsMigration) {
    return null;
  }

  const convertToBlocks = async () => {
    setIsConverting(true);

    try {
      // Simple content parser - converts markdown-style content to blocks
      const blocks = parseContentToBlocks(note.content);
      await onMigrate({ blocks }); // Updated to match new API pattern
    } catch (error) {
      console.error("Migration error:", error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="migration-helper">
      <div className="migration-message">
        <MaterialIcon icon="upgrade" size={20} />
        <span>This note uses the legacy format. Convert to blocks for better editing?</span>
      </div>
      <button
        type="button"
        className="migration-convert-btn"
        onClick={convertToBlocks}
        disabled={isConverting}>
        {isConverting ? (
          <>
            <MaterialIcon icon="hourglass_empty" size={16} />
            Converting...
          </>
        ) : (
          <>
            <MaterialIcon icon="auto_fix_high" size={16} />
            Convert to Blocks
          </>
        )}
      </button>
    </div>
  );
}

function parseContentToBlocks(content) {
  if (!content) return [];

  const blocks = [];
  const lines = content.split("\n");
  let currentBlock = null;
  let blockId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (currentBlock?.type === "code") {
        // End of code block
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        // Start of code block
        const language = line.slice(3).trim() || "javascript";
        currentBlock = {
          id: `block-${blockId++}`,
          type: "code",
          language,
          content: "",
          order: blocks.length,
        };
      }
      continue;
    }

    // Inside code block
    if (currentBlock?.type === "code") {
      currentBlock.content += (currentBlock.content ? "\n" : "") + line;
      continue;
    }

    // Checklist items
    if (line.match(/^\s*-\s*\[(x| )\]/i)) {
      const isChecked = line.match(/\[x\]/i);
      const text = line.replace(/^\s*-\s*\[(x| )\]\s*/i, "");

      if (currentBlock?.type !== "checklist") {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          id: `block-${blockId++}`,
          type: "checklist",
          items: [],
          order: blocks.length,
        };
      }

      currentBlock.items.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        completed: !!isChecked,
      });
      continue;
    }

    // Regular text
    if (line.trim() || !currentBlock) {
      if (currentBlock?.type !== "text") {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          id: `block-${blockId++}`,
          type: "text",
          content: "",
          order: blocks.length,
        };
      }

      if (currentBlock.content && line.trim()) {
        currentBlock.content += "\n" + line;
      } else if (line.trim()) {
        currentBlock.content = line;
      }
    }
  }

  // Add the last block
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  // If no blocks were created, create a single text block
  if (blocks.length === 0 && content.trim()) {
    blocks.push({
      id: "block-1",
      type: "text",
      content: content.trim(),
      order: 0,
    });
  }

  return blocks;
}
