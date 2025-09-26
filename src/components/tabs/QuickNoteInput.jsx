import { useState, useEffect } from "react";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import "./QuickNoteInput.css";

export const QuickNoteInput = ({ onSubmit, onCancel, placeholder = "Quick note..." }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictedCategory, setPredictedCategory] = useState(null);

  // Auto-focus the title input when component mounts
  useEffect(() => {
    const titleInput = document.querySelector(".quick-note-title-input");
    if (titleInput) {
      titleInput.focus();
    }
  }, []);

  // Predict category based on title and content
  useEffect(() => {
    const combinedText = `${title} ${content}`.trim();
    if (!combinedText) {
      setPredictedCategory(null);
      return;
    }

    const prediction = predictCategory(combinedText);
    setPredictedCategory(prediction);
  }, [title, content]);

  const predictCategory = (text) => {
    // Bug keywords
    if (/(bug|error|issue|broken|fix|crash|fail)/i.test(text)) {
      return { category: "bug", icon: "bug_report", color: "var(--color-secondary)" };
    }

    // Todo keywords
    if (/(todo|task|need to|should|must|implement|add|create)/i.test(text)) {
      return { category: "todo", icon: "task_alt", color: "var(--accent)" };
    }

    // Code keywords
    if (
      /(function|class|variable|api|endpoint|query|database)/i.test(text) ||
      /```|`[^`]+`|\w+\(\)|\w+\.\w+/.test(text)
    ) {
      return { category: "code", icon: "code", color: "var(--muted)" };
    }

    // Question keywords
    if (/(how|why|what|when|where|\?)/i.test(text)) {
      return { category: "question", icon: "help", color: "var(--color-accent)" };
    }

    // Wishlist keywords
    if (/(wish|want|would be nice|feature|enhancement|improvement)/i.test(text)) {
      return { category: "wishlist", icon: "star", color: "var(--color-primary)" };
    }

    // Reminder keywords
    if (/(remember|remind|later|tomorrow|deadline|due)/i.test(text)) {
      return { category: "reminder", icon: "schedule", color: "var(--color-primary)" };
    }

    return { category: "other", icon: "note", color: "var(--text)" };
  };

  const handleSubmit = async () => {
    const titleText = title.trim();
    const contentText = content.trim();

    if (!titleText && !contentText) return;

    try {
      setIsSubmitting(true);

      // Create structured note data
      const noteData = {
        title: titleText || "Untitled Note",
        content: contentText,
        category: predictedCategory?.category || "other",
      };

      await onSubmit(noteData);
      setTitle("");
      setContent("");
      setPredictedCategory(null);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="quick-note-input">
      <div className="input-container">
        {/* Title Input */}
        <input
          type="text"
          className="quick-note-title-input"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />

        {/* Content Input */}
        <textarea
          className="quick-note-textarea"
          placeholder="Add note content (optional)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          disabled={isSubmitting}
        />

        {/* Category Prediction */}
        {predictedCategory && (
          <div className="category-prediction">
            <MaterialIcon icon={predictedCategory.icon} size={16} color={predictedCategory.color} />
            <span className="prediction-text">
              Detected as: <strong>{predictedCategory.category}</strong>
            </span>
          </div>
        )}

        {/* Character Counter */}
        <div className="char-counter">
          Title: {title.length} • Content: {content.length} characters
        </div>
        <div className="input-actions">
          <div className="keyboard-hints">
            <span className="hint">
              <kbd>⌘</kbd> + <kbd>Enter</kbd> to save
            </span>
            <span className="hint">
              <kbd>Esc</kbd> to cancel
            </span>
          </div>
        </div>
      </div>
      {/* Quick Tips */}
      {!title && !content && (
        <div className="quicktips-buttons-container">
          <div className="quick-tips">
            <h5>💡 Quick Tips:</h5>
            <ul>
              <li>Start with "TODO:" for automatic todo categorization</li>
              <li>Include "BUG:" or "ISSUE:" for bug reports</li>
              <li>Add code snippets with backticks for code notes</li>
              <li>Use question words (how, why, what) for questions</li>
            </ul>
          </div>

          <div className="action-buttons">
            <ActionButton variant="secondary" size="sm" onClick={onCancel} disabled={isSubmitting}>
              <MaterialIcon icon="close" size={16} />
              Cancel
            </ActionButton>

            <ActionButton
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={(!title.trim() && !content.trim()) || isSubmitting}>
              {isSubmitting ? (
                <>
                  <MaterialIcon icon="hourglass_empty" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <MaterialIcon icon="add" size={16} />
                  Create Note
                </>
              )}
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
};
