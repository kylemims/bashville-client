import React, { useState } from "react";
import ReactDOM from "react-dom";
import { patchNote } from "../../services/noteService.js";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { TextBlock } from "../tabs/blocks/TextBlock.jsx";
import { ChecklistBlock } from "../tabs/blocks/ChecklistBlock.jsx";
import { CodeBlock } from "../tabs/blocks/CodeBlock.jsx";
import { NoteMigrationHelper } from "./NoteMigrationHelper.jsx";
import "./BlockBasedNoteCard.css";

export function BlockBasedNoteCard({ note, onUpdate, onDelete, navigateProject, availableProjects = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Initialize tag input when editing starts
  React.useEffect(() => {
    if (isEditingMeta) {
      setTagInput(Array.isArray(note.custom_tags) ? note.custom_tags.join(", ") : note.custom_tags || "");
    }
  }, [isEditingMeta, note.custom_tags]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  const blocks = note.blocks || [];

  // Category display configurations (from NoteCard)
  const categoryConfig = {
    bug: { icon: "bug_report", color: "var(--color-secondary)", label: "Bug" },
    todo: { icon: "task_alt", color: "var(--third)", label: "Todo" },
    wishlist: { icon: "wand_stars", color: "var(--fourth)", label: "Wishlist" },
    code: { icon: "code", color: "var(--muted)", label: "Code" },
    question: { icon: "help", color: "var(--sixth)", label: "Question" },
    reminder: { icon: "schedule", color: "var(--color-primary)", label: "Reminder" },
    note: { icon: "note", color: "var(--text)", label: "Note" },
    other: { icon: "note", color: "var(--text)", label: "Note" },
  };

  const categoryDisplay = categoryConfig[note.category] || categoryConfig.other;

  // Priority display configurations
  const priorityConfig = {
    low: { icon: "water", color: "#4A7CA8", label: "L" },
    medium: { icon: "water", color: "var(--fifth)", label: "M" },
    high: { icon: "water", color: "var(--color-secondary)", label: "H" },
  };

  const priorityDisplay = priorityConfig[note.priority_level] || priorityConfig.medium;

  // Handle note updates through API
  const handleNoteUpdate = async (updateData) => {
    if (updating) return; // Prevent duplicate calls

    try {
      setUpdating(true);
      console.log("🔄 Updating note via API:", note.id, updateData);

      const updatedNote = await patchNote(note.id, updateData);
      console.log("✅ Note updated successfully:", updatedNote);

      // Call the parent update handler with the full updated note
      onUpdate(updatedNote);
    } catch (error) {
      console.error("❌ Failed to update note:", error);
      console.error("❌ Error details:", error.message, error.response);

      // Try to get more specific error information
      if (error.response && error.response.data) {
        console.error("❌ Backend error response:", error.response.data);
      }

      // TODO: Show error toast or message
    } finally {
      setUpdating(false);
    }
  };

  const updateBlock = (blockId, updates) => {
    console.log("🔄 Updating block:", blockId, updates);
    const updatedBlocks = blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block));
    console.log("📝 Updated blocks:", updatedBlocks);
    handleNoteUpdate({ blocks: updatedBlocks });
  };

  const deleteBlock = (blockId) => {
    console.log("🗑️ Deleting block:", blockId);
    const updatedBlocks = blocks.filter((block) => block.id !== blockId);
    console.log("📝 Blocks after delete:", updatedBlocks);
    handleNoteUpdate({ blocks: updatedBlocks });
  };

  const moveBlock = (blockId, direction) => {
    const currentIndex = blocks.findIndex((block) => block.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const updatedBlocks = [...blocks];
    [updatedBlocks[currentIndex], updatedBlocks[newIndex]] = [
      updatedBlocks[newIndex],
      updatedBlocks[currentIndex],
    ];

    // Update order values
    updatedBlocks.forEach((block, index) => {
      block.order = index;
    });

    handleNoteUpdate({ blocks: updatedBlocks });
  };

  const addBlock = (type) => {
    console.log("➕ Adding block of type:", type);
    console.log("📋 Current blocks:", blocks);

    const newBlock = {
      id: `block-${Date.now()}`,
      type: type,
      order: blocks.length,
      ...(type === "text" && { content: "" }),
      ...(type === "checklist" && { items: [] }),
      ...(type === "code" && { content: "", language: "javascript" }),
    };

    console.log("🆕 New block:", newBlock);

    const updatedBlocks = [...blocks, newBlock];
    console.log("📝 Updated blocks array:", updatedBlocks);

    handleNoteUpdate({ blocks: updatedBlocks });
    setIsAddingBlock(false);
  };
  const renderBlock = (block, index) => {
    const commonProps = {
      block,
      onUpdate: updateBlock,
      onDelete: deleteBlock,
      onMoveUp: (blockId) => moveBlock(blockId, "up"),
      onMoveDown: (blockId) => moveBlock(blockId, "down"),
      isFirst: index === 0,
      isLast: index === blocks.length - 1,
    };

    switch (block.type) {
      case "text":
        return <TextBlock key={block.id} {...commonProps} />;
      case "checklist":
        return <ChecklistBlock key={block.id} {...commonProps} />;
      case "code":
        return <CodeBlock key={block.id} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Collapsed card view */}
      <div className={`block-note-card`}>
        <div
          className={`note-card-preview ${note.is_completed ? "completed" : ""}`}
          onClick={() => setIsExpanded(true)}>
          <div className="note-title-row">
            <div className="note-title-category-priority-group">
              <div
                className="note-category"
                style={{
                  backgroundColor: categoryDisplay.color,
                  color: categoryDisplay.color === "var(--text)" ? "var(--bg-primary)" : "var(--bg-primary)",
                }}>
                <MaterialIcon icon={categoryDisplay.icon} size={14} />
              </div>
              <div
                className="note-priority"
                style={{
                  backgroundColor: priorityDisplay.color,
                  color: priorityDisplay.color === "var(--bg-primary)" ? "var(--text)" : "var(--bg-primary)",
                }}>
                <span>{priorityDisplay.label}</span>
              </div>
            </div>
            <span className="block-count">
              {blocks.length} blocks
              <MaterialIcon icon="expand_more" size={20} />
            </span>
          </div>
        </div>
        <div className="note-meta">
          <div>
            {note.is_completed && <MaterialIcon icon="check_circle" size={16} color="var(--color-accent)" />}
            <h3 className={`note-title ${note.is_completed ? "completed" : ""}`}>{note.title}</h3>

            {/* Tags display */}
            {note.custom_tags && note.custom_tags.length > 0 && (
              <div className="note-tags">
                {note.custom_tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="note-tag">
                    {tag}
                  </span>
                ))}
                {note.custom_tags.length > 3 && (
                  <span className="note-tag-more">+{note.custom_tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
          <span className="note-date">{new Date(note.created_at).toLocaleDateString()}</span>
        </div>
        <div className="note-preview-actions">
          <div className="quick-actions">
            <button
              type="button"
              className="quick-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                addBlock("text");
                setIsExpanded(true);
              }}
              title="Add text">
              <MaterialIcon icon="text_fields" size={14} />
            </button>
            <button
              type="button"
              className="quick-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                addBlock("checklist");
                setIsExpanded(true);
              }}
              title="Add checklist">
              <MaterialIcon icon="checklist" size={14} />
            </button>
            <button
              type="button"
              className="quick-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                addBlock("code");
                setIsExpanded(true);
              }}
              title="Add code">
              <MaterialIcon icon="code" size={14} />
            </button>
          </div>
        </div>
        {note.project_title && (
          <div className="note-card-title-icon-group">
            <button
              type="button"
              className="proj-card-title-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (navigateProject && note.project) {
                  navigateProject(note.project);
                }
              }}
              title={`Go to ${note.project_title} project`}>
              <MaterialIcon icon="visibility" size={18} />
              {note.project_title}
            </button>
          </div>
        )}
      </div>

      {/* Modal overlay for expanded view - Rendered using Portal */}
      {isExpanded &&
        ReactDOM.createPortal(
          <div className="note-modal-overlay" onClick={() => setIsExpanded(false)}>
            <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="note-modal-header">
                <div className="note-modal-title-section">
                  {/* <input
                    type="text"
                    value={note.title}
                    onChange={(e) =>
                      handleNoteUpdate({
                        title: e.target.value,
                        blocks: note.blocks, 
                      })
                    }
                    className="note-modal-title-input"
                    placeholder="Note title..."
                  /> */}
                  <div className="note-modal-meta-compact">
                    <div
                      className="note-category"
                      style={{
                        backgroundColor: categoryDisplay.color,
                        color:
                          categoryDisplay.color === "var(--text)" ? "var(--bg-primary)" : "var(--bg-primary)",
                      }}>
                      <MaterialIcon icon={categoryDisplay.icon} size={12} />
                      <span>{categoryDisplay.label}</span>
                    </div>
                    <div
                      className="note-priority"
                      style={{
                        backgroundColor: priorityDisplay.color,
                        color: "var(--bg-primary)",
                      }}>
                      <MaterialIcon icon={priorityDisplay.icon} size={10} />
                      <span>{priorityDisplay.label}</span>
                    </div>
                  </div>
                </div>
                <div className="note-modal-actions">
                  <button
                    type="button"
                    className="note-action-btn"
                    onClick={() => setIsEditingMeta(!isEditingMeta)}
                    title="Edit details">
                    <MaterialIcon icon="edit" size={18} />
                  </button>
                  <button
                    type="button"
                    className="note-action-btn"
                    onClick={() => setIsAddingBlock(!isAddingBlock)}
                    title="Add block">
                    <MaterialIcon icon="add" size={18} />
                  </button>
                  <button
                    type="button"
                    className="note-action-btn delete"
                    onClick={() => onDelete(note.id)}
                    title="Delete note">
                    <MaterialIcon icon="delete" size={18} />
                  </button>
                  <button
                    type="button"
                    className="note-action-btn"
                    onClick={() => setIsExpanded(false)}
                    title="Close">
                    <MaterialIcon icon="close" size={18} />
                  </button>
                </div>
              </div>

              {/* Modal body content */}
              <div className="note-modal-body">
                {/* Metadata editing section */}
                {isEditingMeta && (
                  <div className="note-meta-editor">
                    <div className="meta-editor-row">
                      <div className="meta-field">
                        <label className="meta-label">Category</label>
                        <select
                          value={note.category || "note"}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleNoteUpdate({
                              category: e.target.value,
                              blocks: note.blocks, // Include blocks for Django validation
                            });
                          }}
                          onFocus={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="meta-select"
                          disabled={updating}>
                          <option value="note">Note</option>
                          <option value="bug">Bug</option>
                          <option value="todo">Todo</option>
                          <option value="wishlist">Wishlist</option>
                          <option value="code">Code</option>
                          <option value="question">Question</option>
                          <option value="reminder">Reminder</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="meta-field">
                        <label className="meta-label">Priority</label>
                        <select
                          value={note.priority_level || "medium"}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleNoteUpdate({
                              priority_level: e.target.value,
                              blocks: note.blocks, // Include blocks for Django validation
                            });
                          }}
                          onFocus={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="meta-select"
                          disabled={updating}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="meta-field">
                        <label className="meta-label">
                          <MaterialIcon icon="task_alt" size={16} />
                          Complete
                        </label>
                        <input
                          type="checkbox"
                          checked={note.is_completed || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleNoteUpdate({
                              is_completed: e.target.checked,
                              blocks: note.blocks, // Include blocks for Django validation
                            });
                          }}
                          onFocus={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="meta-checkbox"
                          disabled={updating}
                        />
                      </div>
                      <div className="meta-field">
                        <label className="meta-label">
                          <MaterialIcon icon="star" size={16} />
                          Important
                        </label>
                        <input
                          type="checkbox"
                          checked={note.is_important || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleNoteUpdate({
                              is_important: e.target.checked,
                              blocks: note.blocks, // Include blocks for Django validation
                            });
                          }}
                          onFocus={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="meta-checkbox"
                          disabled={updating}
                        />
                      </div>
                    </div>
                    <div className="meta-field">
                      <label className="meta-label">
                        <MaterialIcon icon="folder" size={16} />
                        Project
                      </label>
                      <select
                        value={note.project || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          const projectId = e.target.value || null;
                          handleNoteUpdate({
                            project: projectId,
                            blocks: note.blocks, // Include blocks for Django validation
                          });
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="meta-select"
                        disabled={updating}>
                        <option value="">No Project</option>
                        {availableProjects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="meta-field">
                      <label className="meta-label">Tags</label>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => {
                          e.stopPropagation();
                          setTagInput(e.target.value);
                        }}
                        onBlur={(e) => {
                          e.stopPropagation();
                          const tags = tagInput
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean);

                          // Only update if tags actually changed
                          const currentTags = Array.isArray(note.custom_tags) ? note.custom_tags : [];
                          const tagsChanged =
                            JSON.stringify(tags.sort()) !== JSON.stringify(currentTags.sort());

                          if (tagsChanged) {
                            handleNoteUpdate({
                              custom_tags: tags,
                              blocks: note.blocks, // Include blocks for Django validation
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          // Save on Enter key
                          if (e.key === "Enter") {
                            e.target.blur(); // Trigger onBlur to save
                          }
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Add tags separated by commas..."
                        className="meta-input"
                        disabled={updating}
                      />
                    </div>
                  </div>
                )}

                {/* Migration helper for legacy notes */}
                <NoteMigrationHelper note={note} onMigrate={handleNoteUpdate} />

                {/* Add block menu */}
                {isAddingBlock && (
                  <div className="add-block-menu">
                    <button type="button" className="add-block-btn" onClick={() => addBlock("text")}>
                      <MaterialIcon icon="text_fields" size={16} />
                      <span>Text</span>
                    </button>
                    <button type="button" className="add-block-btn" onClick={() => addBlock("checklist")}>
                      <MaterialIcon icon="checklist" size={16} />
                      <span>Checklist</span>
                    </button>
                    <button type="button" className="add-block-btn" onClick={() => addBlock("code")}>
                      <MaterialIcon icon="code" size={16} />
                      <span>Code</span>
                    </button>
                  </div>
                )}

                {/* Blocks */}
                <div className="note-blocks">
                  {blocks.length === 0 ?
                    <div className="empty-note-message">
                      <p>This note is empty. Click the + button to add content blocks.</p>
                    </div>
                  : blocks.map((block, index) => renderBlock(block, index))}
                </div>
              </div>

              {/* Modal footer */}
              <div className="note-modal-footer">
                <div className="note-meta">
                  <span className="note-date">Updated {new Date(note.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
