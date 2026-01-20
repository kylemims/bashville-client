import { useState, useEffect, useCallback } from "react";
import { getNotes, createQuickNote, deleteNote, getNoteStats, searchNotes } from "../../services/noteService";
import { getProjects } from "../../services/projectService";
import { ErrorMessage } from "../common/ErrorMessage.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { BlockBasedNoteCard } from "../project/BlockBasedNoteCard.jsx";
import { QuickNoteInput } from "./QuickNoteInput.jsx";
import { NoteFilters } from "./NoteFilters.jsx";
import { NoteStats } from "./NoteStats.jsx";
import { useNavigate } from "react-router-dom";
import "./NotesTab.css";

export const NotesTab = ({
  project,
  showStats = false,
  onCloseStats,
  showQuickNote = false,
  onCloseQuickNote,
  onOpenQuickNote,
  showFilterSidebar,
  onCloseFilterSidebar,
}) => {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null); // Add missing stats state
  const [projects, setProjects] = useState([]); // Available projects for assignment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    is_completed: null,
    is_archived: false,
    is_important: null,
    project: project?.id || null,
  });
  const [sortBy, setSortBy] = useState("sort_by"); // Most recent first
  const [viewMode, setViewMode] = useState("columns"); // "grid" or "columns"
  const [useBlockMode, setUseBlockMode] = useState(true); // New block-based architecture
  const [groupBy, setGroupBy] = useState("category"); // "none", "project", "category", "priority"
  const [showAllNotes, setShowAllNotes] = useState(false); // Toggle between project-specific and all user notes
  const navigate = useNavigate();

  // Load notes when component mounts or filters change
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = {
        ...filters,
        ordering: sortBy,
      };

      // Handle project filtering based on showAllNotes toggle
      if (showAllNotes) {
        // Remove project filter to show all notes
        delete queryParams.project;
        console.log("🌍 Loading ALL notes - queryParams:", queryParams);
      } else if (project?.id) {
        // Set project filter to show only current project's notes
        queryParams.project = project.id;
        console.log("📁 Loading project-specific notes - queryParams:", queryParams);
      }

      const response = await getNotes(queryParams);
      setNotes(response.results || response); // Handle both paginated and simple responses
    } catch (err) {
      console.error("❌ Failed to load notes:", err);
      setError(`Failed to load notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, project?.id, showAllNotes]);

  const loadStats = useCallback(async () => {
    try {
      // Use project ID only if we're not showing all notes
      const projectId = project?.id && !showAllNotes ? project.id : null;
      const statsData = await getNoteStats(projectId);
      setStats(statsData);
    } catch (err) {
      console.error("❌ Failed to load stats:", err);
      // Don't show error for stats, it's not critical
    }
  }, [project?.id, showAllNotes]);

  const loadProjects = useCallback(async () => {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (err) {
      console.error("❌ Failed to load projects:", err);
      // Don't show error for projects, it's not critical for note viewing
    }
  }, []);

  // Update filters when showAllNotes changes
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      project: showAllNotes ? null : project?.id || null,
    }));
  }, [showAllNotes, project?.id]);

  useEffect(() => {
    loadNotes();
    loadStats();
    loadProjects();
  }, [loadNotes, loadStats, loadProjects]);

  const handleQuickNoteCreate = async (noteData) => {
    try {
      setLoading(true);
      setError("");

      // Handle both old string format and new structured format
      let newNote;
      if (typeof noteData === "string") {
        // Legacy format - content only
        newNote = await createQuickNote(noteData);
      } else {
        // New structured format with title, content, category
        newNote = await createQuickNote(noteData.content || noteData.title, project?.id, {
          title: noteData.title,
          category: noteData.category,
        });
      }

      setNotes((prevNotes) => [newNote, ...prevNotes]);
      loadStats(); // Refresh stats
      onCloseQuickNote?.(); // Close the quick note form after successful creation
      console.log("✅ Quick note created");
    } catch (err) {
      console.error("❌ Failed to create quick note:", err);
      setError(`Failed to create quick note: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If empty search, just reload with current filters
      loadNotes();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await searchNotes(searchQuery);
      setNotes(response.results || response);
    } catch (err) {
      console.error("❌ Search failed:", err);
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    loadStats();
  };

  const handleNoteDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note? This cannot be undone.")) {
      return;
    }

    try {
      setError("");
      await deleteNote(noteId);

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      loadStats();

      console.log("✅ Note deleted");
    } catch (err) {
      console.error("❌ Failed to delete note:", err);
      setError(`Failed to delete note: ${err.message}`);
    }
  };

  const onProjectClick = (projectId) => {
    // If no projectId provided, use the current project (for backward compatibility)
    const targetProjectId = projectId || project?.id;
    if (targetProjectId) {
      navigate(`/projects/${targetProjectId}`);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      is_completed: null,
      is_archived: false,
      is_important: null,
      project: project?.id || null,
    });
    setSearchQuery("");
  };

  const getFilteredNoteCount = () => {
    if (!notes) return 0;
    return notes.length;
  };

  const groupNotes = (notes, groupBy) => {
    if (groupBy === "none") {
      return { "All Notes": notes };
    }

    const groups = {};

    notes.forEach((note) => {
      let groupKey;

      switch (groupBy) {
        case "project":
          groupKey = note.project_title || note.project_name || "No Project";
          break;
        case "category":
          groupKey = note.category_display || note.category || "Other";
          break;
        case "priority":
          groupKey = `${
            (note.priority_level || "medium").charAt(0).toUpperCase() +
            (note.priority_level || "medium").slice(1)
          } Priority`;
          break;
        default:
          groupKey = "All Notes";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(note);
    });

    return groups;
  };

  const renderNotesContent = () => {
    if (viewMode === "grid") {
      return (
        <div className="notes-grid">
          {notes.map((note) => (
            <BlockBasedNoteCard
              key={note.id}
              note={note}
              onUpdate={handleNoteUpdate}
              onDelete={() => handleNoteDelete(note.id)}
              navigateProject={onProjectClick}
              availableProjects={projects}
            />
          ))}
        </div>
      );
    }

    // Column view
    const groupedNotes = groupNotes(notes, groupBy);

    return (
      <div className="notes-columns">
        {Object.entries(groupedNotes).map(([groupName, groupNotes]) => (
          <div key={groupName} className="notes-column" data-category={groupName.toLowerCase()}>
            <div className="column-header">
              <h4 className="column-title">{groupName}</h4>
              <div className="command-gradient-line"></div>
              <span className="column-count">{groupNotes.length}</span>
            </div>
            <div className="column-notes">
              {groupNotes.map((note) => (
                <BlockBasedNoteCard
                  key={note.id}
                  note={note}
                  onUpdate={handleNoteUpdate}
                  onDelete={() => handleNoteDelete(note.id)}
                  navigateProject={onProjectClick}
                  availableProjects={projects}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="notes-tab">
      {showStats && stats && (
        <NoteStats stats={stats} projectTitle={project?.title} onCloseStats={onCloseStats} />
      )}

      {showQuickNote && (
        <QuickNoteInput
          onSubmit={handleQuickNoteCreate}
          onCancel={() => onCloseQuickNote?.()}
          placeholder={project ? `Quick note for ${project.title}...` : "Quick note..."}
        />
      )}

      {/* Consolidated Compact Header */}
      <div className="notes-compact-header">
        {/* Left section: Search */}
        <div className="header-section header-left-search">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="header-search-input"
            />
            <ActionButton variant="muted" size="xs" onClick={handleSearch} disabled={loading}>
              <MaterialIcon icon="search" size={16} />
            </ActionButton>
          </div>
        </div>

        {/* Right section: View controls and project toggle */}
        <div className="header-section header-right-unified">
          {project && (
            <ActionButton
              variant={showAllNotes ? "primary" : "secondary"}
              size="sm"
              onClick={() => setShowAllNotes(!showAllNotes)}
              className="header-button"
              title={showAllNotes ? "Show only this project's notes" : "Show all notes from all projects"}>
              <MaterialIcon icon={showAllNotes ? "folder" : "dashboard"} size={16} />
              <span className="button-text">{showAllNotes ? "Project Notes" : "All Notes"}</span>
            </ActionButton>
          )}

          <div className="view-mode-selector">
            <ActionButton
              variant={viewMode === "grid" ? "primary" : "cold"}
              size="xs"
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className="header-icon-button">
              <MaterialIcon icon="grid_view" size={20} />
            </ActionButton>
            <ActionButton
              variant={viewMode === "columns" ? "primary" : "cold"}
              size="xs"
              onClick={() => setViewMode("columns")}
              title="Column View"
              className="header-icon-button">
              <MaterialIcon icon="view_column" size={20} />
            </ActionButton>
          </div>

          {viewMode === "columns" && (
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="header-select">
              <option value="none">No Grouping</option>
              <option value="project">Group by Project</option>
              <option value="category">Group by Category</option>
              <option value="priority">Group by Priority</option>
            </select>
          )}
        </div>
      </div>

      {/* Error Message */}
      <ErrorMessage message={error} onDismiss={() => setError("")} />

      {/* Mode Indicator */}
      {/* {project && showAllNotes && (
        <div className="notes-mode-indicator">
          <MaterialIcon icon="info" size={16} />
          <span>Showing all notes from all projects • </span>
          <button type="button" className="mode-indicator-link" onClick={() => setShowAllNotes(false)}>
            Show only "{project.title}" notes
          </button>
        </div>
      )} */}

      {/* Notes List */}
      <div className="notes-content">
        {loading && (
          <div className="loading-spinner">
            <MaterialIcon icon="hourglass_empty" size={24} />
            <span>Loading notes...</span>
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="empty-state">
            <MaterialIcon icon="note_add" size={48} color="var(--muted)" />
            <h4>No notes found</h4>
            <p>
              {searchQuery || Object.values(filters).some((f) => f && f !== project?.id) ?
                "Try adjusting your search or filters"
              : project ?
                `Start taking notes for ${project.title}`
              : "Create your first note to get started"}
            </p>
            <ActionButton
              variant="primary"
              size="md"
              onClick={() => {
                console.log("Create Note button clicked in empty state");
                onOpenQuickNote?.();
              }}>
              <MaterialIcon icon="add" size={18} />
              Create Note
            </ActionButton>
          </div>
        )}

        {!loading && notes.length > 0 && renderNotesContent()}
      </div>
      {showFilterSidebar && (
        <div className="filter-sidebar-container">
          <div className="filter-sidebar-header">
            <span className="filter-sidebar-title">FILTER + SORT</span>
            <button
              type="button"
              className="filter-sidebar-close-button"
              onClick={onCloseFilterSidebar}
              title="Close">
              <MaterialIcon icon="close" size={18} />
            </button>
          </div>
          <div className="filter-sidebar-content">
            <div className="filter-sidebar-ribbon-group">
              <div className="filter-sidebar-group-controls">
                <NoteFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={clearFilters}
                  resultCount={getFilteredNoteCount()}
                  compact={true}
                  className="filter-sidebar-flex"
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ribbon-select">
                  <option value="sort_by" className="sort-by-label">
                    Sort By:
                  </option>
                  <option value="-created_at">Newest First</option>
                  <option value="created_at">Oldest First</option>
                  <option value="-updated_at">Recently Updated</option>
                  <option value="title">Title A-Z</option>
                  <option value="-title">Title Z-A</option>
                  <option value="category">Category</option>
                  <option value="-is_important,created_at">Important First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
