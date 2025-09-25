import React, { useState } from "react";
import { BaseBlock } from "./BaseBlock.jsx";
import { MaterialIcon } from "../../common/MaterialIcon.jsx";
import "./ChecklistBlock.css";

export function ChecklistBlock({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [newItemText, setNewItemText] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const items = block.items || [];

  const addItem = () => {
    if (!newItemText.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      text: newItemText.trim(),
      completed: false,
    };

    onUpdate(block.id, {
      items: [...items, newItem],
    });

    setNewItemText("");
  };

  const updateItem = (itemId, updates) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, ...updates } : item));
    onUpdate(block.id, { items: updatedItems });
  };

  const deleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    onUpdate(block.id, { items: updatedItems });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const handleItemKeyDown = (e, itemId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setEditingItem(null);
    } else if (e.key === "Escape") {
      setEditingItem(null);
    }
  };

  const startEditingItem = (itemId) => {
    setEditingItem(itemId);
  };

  const saveItemEdit = (itemId, newText) => {
    updateItem(itemId, { text: newText.trim() });
    setEditingItem(null);
  };

  return (
    <BaseBlock
      block={block}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      isFirst={isFirst}
      isLast={isLast}>
      <div className="checklist-block">
        {/* Existing items */}
        <div className="checklist-items">
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              isEditing={editingItem === item.id}
              onToggle={() => updateItem(item.id, { completed: !item.completed })}
              onDelete={() => deleteItem(item.id)}
              onEdit={() => startEditingItem(item.id)}
              onSave={(newText) => saveItemEdit(item.id, newText)}
              onCancel={() => setEditingItem(null)}
              onKeyDown={(e) => handleItemKeyDown(e, item.id)}
            />
          ))}
        </div>

        {/* Add new item */}
        <div className="checklist-add-item">
          <button
            type="button"
            className="checklist-checkbox checklist-add-checkbox"
            onClick={() => document.querySelector(".checklist-add-input")?.focus()}>
            <MaterialIcon icon="add" size={14} />
          </button>
          <input
            type="text"
            className="checklist-add-input"
            placeholder="Add item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </BaseBlock>
  );
}

function ChecklistItem({ item, isEditing, onToggle, onDelete, onEdit, onSave, onCancel, onKeyDown }) {
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    onSave(editText);
  };

  if (isEditing) {
    return (
      <div className="checklist-item editing">
        <button
          type="button"
          className={`checklist-checkbox ${item.completed ? "completed" : ""}`}
          onClick={onToggle}>
          {item.completed && <MaterialIcon icon="check" size={14} />}
        </button>
        <input
          type="text"
          className="checklist-item-edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="checklist-item">
      <button
        type="button"
        className={`checklist-checkbox ${item.completed ? "completed" : ""}`}
        onClick={onToggle}>
        {item.completed && <MaterialIcon icon="check" size={14} />}
      </button>
      <span className={`checklist-text ${item.completed ? "completed" : ""}`} onClick={onEdit}>
        {item.text}
      </span>
      <button type="button" className="checklist-item-delete" onClick={onDelete} title="Delete item">
        <MaterialIcon icon="close" size={12} />
      </button>
    </div>
  );
}
