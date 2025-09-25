import React from "react";
import "./BaseBlock.css";
import { MaterialIcon } from "../../common/MaterialIcon.jsx";

export function BaseBlock({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  showHandles = false,
  children,
}) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(block.id);
  };

  return (
    <div className="base-block">
      {/* Minimal action bar - only shows on hover */}
      <div className="block-actions">
        <div className="block-reorder">
          {!isFirst && (
            <button
              type="button"
              className="block-move-btn"
              onClick={() => onMoveUp(block.id)}
              title="Move up">
              <MaterialIcon icon="keyboard_arrow_up" size={16} />
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              className="block-move-btn"
              onClick={() => onMoveDown(block.id)}
              title="Move down">
              <MaterialIcon icon="keyboard_arrow_down" size={16} />
            </button>
          )}
        </div>
        <button type="button" className="block-delete-btn" onClick={handleDelete} title="Delete block">
          <MaterialIcon icon="close" size={16} />
        </button>
      </div>

      {/* Block content */}
      <div className="block-content">{children}</div>
    </div>
  );
}
