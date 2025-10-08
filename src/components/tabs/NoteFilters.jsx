import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { useState } from "react";
import "./NoteFilters.css";

export const NoteFilters = ({ filters, onFiltersChange, onClearFilters, resultCount, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: "", label: "Category" },
    { value: "todo", label: "Todo" },
    { value: "bug", label: "Bug" },
    { value: "wishlist", label: "Wishlist" },
    { value: "code", label: "Code" },
    { value: "question", label: "Question" },
    { value: "reminder", label: "Reminder" },
    { value: "other", label: "General" },
  ];

  const completionOptions = [
    { value: null, label: "Status" },
    { value: true, label: "Completed" },
    { value: false, label: "Incomplete" },
  ];

  const importanceOptions = [
    { value: null, label: "Priority" },
    { value: true, label: "Important" },
    { value: false, label: "Normal" },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const hasActiveFilters = () => {
    return (
      filters.category ||
      filters.is_completed !== null ||
      filters.is_important !== null ||
      filters.is_archived
    );
  };

  // Compact mode for ribbon interface
  if (compact) {
    return (
      <div className="filter-sidebar-content">
        <select
          value={filters.category || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="ribbon-select">
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.is_completed === null ? "" : filters.is_completed.toString()}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value === "true";
            handleFilterChange("is_completed", value);
          }}
          className="ribbon-select">
          {completionOptions.map((option) => (
            <option
              key={option.value === null ? "null" : option.value.toString()}
              value={option.value === null ? "" : option.value.toString()}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.is_important === null ? "" : filters.is_important.toString()}
          onChange={(e) => {
            const value = e.target.value === "" ? null : e.target.value === "true";
            handleFilterChange("is_important", value);
          }}
          className="ribbon-select">
          {importanceOptions.map((option) => (
            <option
              key={option.value === null ? "null" : option.value.toString()}
              value={option.value === null ? "" : option.value.toString()}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters() && (
          <ActionButton
            variant="secondary"
            size="xs"
            onClick={onClearFilters}
            title="Clear all filters"
            className="ribbon-button">
            <MaterialIcon icon="clear_all" size={14} />
          </ActionButton>
        )}
      </div>
    );
  }

  return (
    <div className="note-filters">
      <div className="filters-header">
        <h4 className="filters-title">
          <MaterialIcon icon="filter_list" size={18} />
          Filters
        </h4>

        <div className="filters-result-count">
          {resultCount} note{resultCount !== 1 ? "s" : ""}
        </div>

        {hasActiveFilters() && (
          <ActionButton variant="secondary" size="xs" onClick={onClearFilters} title="Clear all filters">
            <MaterialIcon icon="clear_all" size={16} />
            Clear
          </ActionButton>
        )}
        <button
          className="filters-expand-toggle"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}>
          <MaterialIcon icon={isExpanded ? "arrow_drop_down" : "more_horiz"} size={24} />
          {/* {isExpanded ? "Collapse" : "Expand"} */}
        </button>
      </div>

      {isExpanded && (
        <div className="filters-expanded-section">
          <div className="filters-row">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="filter-select">
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Completion Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                value={filters.is_completed === null ? "" : filters.is_completed.toString()}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : e.target.value === "true";
                  handleFilterChange("is_completed", value);
                }}
                className="filter-select">
                {completionOptions.map((option) => (
                  <option
                    key={option.value === null ? "null" : option.value.toString()}
                    value={option.value === null ? "" : option.value.toString()}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Importance Filter */}
            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <select
                value={filters.is_important === null ? "" : filters.is_important.toString()}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : e.target.value === "true";
                  handleFilterChange("is_important", value);
                }}
                className="filter-select">
                {importanceOptions.map((option) => (
                  <option
                    key={option.value === null ? "null" : option.value.toString()}
                    value={option.value === null ? "" : option.value.toString()}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Archive Toggle */}
            <div className="filter-group filter-toggle">
              <label className="note-archived-toggle">
                <input
                  type="checkbox"
                  checked={filters.is_archived || false}
                  onChange={(e) => handleFilterChange("is_archived", e.target.checked)}
                  className="filter-checkbox"
                />
                <span className="checkbox-icon">
                  <MaterialIcon icon={filters.is_archived ? "archive" : "inventory_2"} size={16} />
                </span>
                Show Archived
              </label>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters() && (
              <div className="active-filters">
                <span className="active-filters-label">Active filters:</span>

                {filters.category && (
                  <span className="filter-tag">
                    Category: {categoryOptions.find((opt) => opt.value === filters.category)?.label}
                    <button onClick={() => handleFilterChange("category", "")} className="filter-remove">
                      <MaterialIcon icon="close" size={14} />
                    </button>
                  </span>
                )}

                {filters.is_completed !== null && (
                  <span className="filter-tag">
                    Status: {filters.is_completed ? "Completed" : "Incomplete"}
                    <button
                      onClick={() => handleFilterChange("is_completed", null)}
                      className="filter-remove">
                      <MaterialIcon icon="close" size={14} />
                    </button>
                  </span>
                )}

                {filters.is_important !== null && (
                  <span className="filter-tag">
                    Priority: {filters.is_important ? "Important" : "Normal"}
                    <button
                      onClick={() => handleFilterChange("is_important", null)}
                      className="filter-remove">
                      <MaterialIcon icon="close" size={14} />
                    </button>
                  </span>
                )}

                {filters.is_archived && (
                  <span className="filter-tag">
                    Archived
                    <button
                      onClick={() => handleFilterChange("is_archived", false)}
                      className="filter-remove">
                      <MaterialIcon icon="close" size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Quick Filter Buttons */}
          <div className="quick-filters">
            <h5 className="quick-filters-title">Quick Filters:</h5>
            <div className="quick-filter-buttons">
              <ActionButton
                variant={filters.is_important === true ? "primary" : "secondary"}
                size="xs"
                onClick={() =>
                  handleFilterChange("is_important", filters.is_important === true ? null : true)
                }>
                <MaterialIcon icon="star" size={14} />
                Important
              </ActionButton>

              <ActionButton
                variant={filters.is_completed === false ? "primary" : "secondary"}
                size="xs"
                onClick={() =>
                  handleFilterChange("is_completed", filters.is_completed === false ? null : false)
                }>
                <MaterialIcon icon="task_alt" size={14} />
                Todo
              </ActionButton>

              <ActionButton
                variant={filters.category === "bug" ? "primary" : "secondary"}
                size="xs"
                onClick={() => handleFilterChange("category", filters.category === "bug" ? "" : "bug")}>
                <MaterialIcon icon="bug_report" size={14} />
                Bugs
              </ActionButton>

              <ActionButton
                variant={filters.category === "code" ? "primary" : "secondary"}
                size="xs"
                onClick={() => handleFilterChange("category", filters.category === "code" ? "" : "code")}>
                <MaterialIcon icon="code" size={14} />
                Code
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
