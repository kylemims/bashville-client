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

  return (
    <div className="page-content page-enter">
      <div className="notes-page">
        <div className="notes-page-header">
          <div className="header-content">
            <div className="header-main">
              <ActionButton
                variant="back"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                title="Back to Dashboard">
                <MaterialIcon icon="arrow_back" size={20} />
              </ActionButton>

              <div className="header-text">
                <h1 className="page-title">All Notes</h1>
                <p className="page-subtitle">View and manage notes across all your projects</p>
              </div>
            </div>

            <div className="header-actions">
              <ActionButton
                variant="secondary"
                size="md"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                title="Back to Dashboard">
                <MaterialIcon icon="dashboard" size={18} />
                Dashboard
              </ActionButton>
            </div>
          </div>
        </div>

        <div className="notes-page-content">
          <NotesTab project={null} />
        </div>
      </div>
    </div>
  );
};
