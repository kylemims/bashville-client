import { useState, useEffect, useCallback } from "react";
import { getNotes, createQuickNote, deleteNote, getNoteStats, searchNotes } from "../../services/noteService";
import { ErrorMessage } from "../common/ErrorMessage.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { BlockBasedNoteCard } from "../project/BlockBasedNoteCard.jsx";
import { QuickNoteInput } from "./QuickNoteInput.jsx";
import { NoteFilters } from "./NoteFilters.jsx";
import { NoteStats } from "./NoteStats.jsx";
import "./NotesTab.css";

export const NotesTab = ({
  project,
  showStats = false,
  showQuickNote = false,
  onCloseQuickNote,
  onOpenQuickNote,
}) => {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null); // Add missing stats state
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
  const [sortBy, setSortBy] = useState("-created_at"); // Most recent first
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "columns"
  const [useBlockMode, setUseBlockMode] = useState(true); // New block-based architecture
  const [groupBy, setGroupBy] = useState("none"); // "none", "project", "category", "priority"

  // Load notes when component mounts or filters change
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = {
        ...filters,
        ordering: sortBy,
      };

      // Only include project filter if we're in project context
      if (project?.id) {
        queryParams.project = project.id;
      }

      const response = await getNotes(queryParams);
      setNotes(response.results || response); // Handle both paginated and simple responses
    } catch (err) {
      console.error("❌ Failed to load notes:", err);
      setError(`Failed to load notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, project?.id]);

  const loadStats = useCallback(async () => {
    try {
      const projectId = project?.id || null;
      const statsData = await getNoteStats(projectId);
      setStats(statsData);
    } catch (err) {
      console.error("❌ Failed to load stats:", err);
      // Don't show error for stats, it's not critical
    }
  }, [project?.id]);

  useEffect(() => {
    loadNotes();
    loadStats();
  }, [loadNotes, loadStats]);

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
              <span className="column-count">{groupNotes.length}</span>
            </div>
            <div className="column-notes">
              {groupNotes.map((note) => (
                <BlockBasedNoteCard
                  key={note.id}
                  note={note}
                  onUpdate={handleNoteUpdate}
                  onDelete={() => handleNoteDelete(note.id)}
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
      {showStats && stats && <NoteStats stats={stats} projectTitle={project?.title} />}

      {showQuickNote && (
        <QuickNoteInput
          onSubmit={handleQuickNoteCreate}
          onCancel={() => onCloseQuickNote?.()}
          placeholder={project ? `Quick note for ${project.title}...` : "Quick note..."}
        />
      )}
      {/* Ribbon Interface - Microsoft Word style */}
      <div className="notes-ribbon">
        <div className="ribbon-tabs">
          <div className="ribbon-tab active">
            <MaterialIcon icon="home" size={16} />
            <span>Home</span>
          </div>
        </div>

        <div className="ribbon-content">
          {/* Actions Group */}
          <div className="ribbon-group">
            <div className="group-label">Actions</div>
            <div className="group-controls">
              {!showQuickNote && (
                <ActionButton
                  variant="accent"
                  size="sm"
                  onClick={() => onOpenQuickNote?.()}
                  className="ribbon-button">
                  <MaterialIcon icon="add" size={16} />
                  <span>Quick Note</span>
                </ActionButton>
              )}
            </div>
          </div>

          {/* Search Group */}
          <div className="ribbon-group">
            <div className="group-label">Search</div>
            <div className="group-controls search-controls">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="ribbon-search-input"
                />
                <ActionButton variant="primary" size="sm" onClick={handleSearch} disabled={loading}>
                  <MaterialIcon icon="search" size={16} />
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Filters Group */}
          <div className="ribbon-group">
            <div className="group-label">Filter & Sort</div>
            <div className="group-controls">
              <NoteFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
                resultCount={getFilteredNoteCount()}
                compact={true}
              />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ribbon-select">
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

          {/* View Group */}
          <div className="ribbon-group">
            <div className="group-label">View</div>
            <div className="group-controls">
              <div className="view-mode-selector">
                <ActionButton
                  variant={useBlockMode ? "primary" : "secondary"}
                  size="xs"
                  onClick={() => setUseBlockMode(!useBlockMode)}
                  title="Toggle Block Mode"
                  className="ribbon-icon-button">
                  <MaterialIcon icon="view_module" size={16} />
                </ActionButton>
                <ActionButton
                  variant={viewMode === "grid" ? "primary" : "secondary"}
                  size="xs"
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className="ribbon-icon-button">
                  <MaterialIcon icon="grid_view" size={16} />
                </ActionButton>
                <ActionButton
                  variant={viewMode === "columns" ? "primary" : "secondary"}
                  size="xs"
                  onClick={() => setViewMode("columns")}
                  title="Column View"
                  className="ribbon-icon-button">
                  <MaterialIcon icon="view_column" size={16} />
                </ActionButton>
              </div>
              {viewMode === "columns" && (
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="ribbon-select">
                  <option value="none">No Grouping</option>
                  <option value="project">Group by Project</option>
                  <option value="category">Group by Category</option>
                  <option value="priority">Group by Priority</option>
                </select>
              )}
            </div>
          </div>

          {/* Stats Group */}
          {stats && (
            <div className="ribbon-group">
              <div className="group-label">Stats</div>
              <div className="group-controls stats-display">
                <div className="stat-item">
                  <MaterialIcon icon="note" size={16} />
                  <span>{stats.total_notes}</span>
                </div>
                <div className="stat-item">
                  <MaterialIcon icon="check_circle" size={16} />
                  <span>{stats.completed_notes}</span>
                </div>
                <div className="stat-item">
                  <MaterialIcon icon="star" size={16} />
                  <span>{stats.important_notes}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      <ErrorMessage message={error} onDismiss={() => setError("")} />

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
              {searchQuery || Object.values(filters).some((f) => f && f !== project?.id)
                ? "Try adjusting your search or filters"
                : project
                ? `Start taking notes for ${project.title}`
                : "Create your first note to get started"}
            </p>
            <ActionButton variant="primary" size="md" onClick={() => onOpenQuickNote?.()}>
              <MaterialIcon icon="add" size={18} />
              Create Note
            </ActionButton>
          </div>
        )}

        {!loading && notes.length > 0 && renderNotesContent()}
      </div>
    </div>
  );
};
