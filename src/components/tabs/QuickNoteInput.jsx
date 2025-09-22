import { useState, useEffect } from "react";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import "./QuickNoteInput.css";

export const QuickNoteInput = ({ onSubmit, onCancel, placeholder = "Quick note..." }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictedCategory, setPredictedCategory] = useState(null);

  // Auto-focus the input when component mounts
  useEffect(() => {
    const textarea = document.querySelector(".quick-note-textarea");
    if (textarea) {
      textarea.focus();
    }
  }, []);

  // Predict category based on content (mirrors backend logic)
  useEffect(() => {
    if (!content.trim()) {
      setPredictedCategory(null);
      return;
    }

    const prediction = predictCategory(content);
    setPredictedCategory(prediction);
  }, [content]);

  const predictCategory = (text) => {
    // Bug keywords
    if (/(bug|error|issue|broken|fix|crash|fail)/i.test(text)) {
      return { category: "bug", confidence: "high", icon: "bug_report", color: "var(--color-secondary)" };
    }

    // Todo keywords
    if (/(todo|task|need to|should|must|implement|add|create)/i.test(text)) {
      return { category: "todo", confidence: "high", icon: "task_alt", color: "var(--accent)" };
    }

    // Code keywords
    if (
      /(function|class|variable|api|endpoint|query|database)/i.test(text) ||
      /```|`[^`]+`|\w+\(\)|\w+\.\w+/.test(text)
    ) {
      return { category: "code", confidence: "medium", icon: "code", color: "var(--muted)" };
    }

    // Question keywords
    if (/(how|why|what|when|where|\?)/i.test(text)) {
      return { category: "question", confidence: "medium", icon: "help", color: "var(--color-accent)" };
    }

    // Wishlist keywords
    if (/(wish|want|would be nice|feature|enhancement|improvement)/i.test(text)) {
      return { category: "wishlist", confidence: "medium", icon: "star", color: "var(--color-primary)" };
    }

    // Reminder keywords
    if (/(remember|remind|later|tomorrow|deadline|due)/i.test(text)) {
      return { category: "reminder", confidence: "medium", icon: "schedule", color: "var(--color-primary)" };
    }

    return { category: "other", confidence: "low", icon: "note", color: "var(--text)" };
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim());
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
        <textarea
          className="quick-note-textarea"
          placeholder={placeholder}
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
              Detected: <strong>{predictedCategory.category}</strong>
              <span className="confidence">({predictedCategory.confidence} confidence)</span>
            </span>
          </div>
        )}

        {/* Character Counter */}
        <div className="char-counter">{content.length} characters</div>
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
      {!content && (
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
              disabled={!content.trim() || isSubmitting}>
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
