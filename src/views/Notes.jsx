import { useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ActionButton } from "../components/common/ActionButton.jsx";
import { MaterialIcon } from "../components/common/MaterialIcon.jsx";
import { NotesTab } from "../components/tabs/NotesTab.jsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import "./Notes.css";

export const Notes = () => {
  const navigate = useNavigate();
  useDocumentTitle("All Notes • Bash Stash");

  // ✅ UI/shell state lifted here because header buttons live here
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  return (
    <div className="page-content page-enter">
      <div className="notes-page">
        <div className="notes-page-header-unified">
          <div className="unified-header-left">
            <ActionButton variant="back" onClick={() => navigate(ROUTES.DASHBOARD)} title="Back to Dashboard">
              <MaterialIcon icon="arrow_back" size={20} />
            </ActionButton>

            <h1 className="page-title-compact" title="View and manage notes across all your projects">
              All Notes
            </h1>
          </div>

          <div className="unified-header-right">
            <ActionButton
              variant="cold"
              size="sm"
              onClick={() => setShowQuickNote((v) => !v)}
              title="Quick Note">
              <MaterialIcon icon="note_stack_add" size={24} />
            </ActionButton>
            <ActionButton
              variant="cold"
              size="sm"
              onClick={() => setShowFilterSidebar((v) => !v)}
              title="Filter & Sort">
              <MaterialIcon icon="filter_alt" size={24} />
            </ActionButton>
            <ActionButton
              variant="cold"
              size="xs"
              onClick={() => setShowStats((v) => !v)}
              title="Toggle Statistics">
              <MaterialIcon icon="bar_chart" size={24} />
            </ActionButton>
          </div>
        </div>

        <div className="notes-page-content">
          <NotesTab
            project={null}
            // ✅ pass UI control down
            showStats={showStats}
            onCloseStats={() => setShowStats(false)}
            showQuickNote={showQuickNote}
            onCloseQuickNote={() => setShowQuickNote(false)}
            onOpenQuickNote={() => setShowQuickNote(true)}
            showFilterSidebar={showFilterSidebar}
            onCloseFilterSidebar={() => setShowFilterSidebar(false)}
          />
        </div>
      </div>
    </div>
  );
};
