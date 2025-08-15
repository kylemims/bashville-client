import { useState } from "react";
import { ActionButton } from "../common/ActionButton.jsx";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { generateBashScript } from "../../utils/generateBashScript.js";
import { generateReadme } from "../../utils/generateReadme.js";
import { copyToClipboard } from "../../utils/copyToClipboard.js";
import { downloadFile } from "../../utils/downloadFile.js";
import "./SetupGenerator.css";

export const SetupGenerator = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState("bash");

  // Generate README content
  if (!project) {
    return null; // Handle case where project is not provided
  }
  const bashScript = generateBashScript(project);
  const readmeContent = generateReadme(project);

  return (
    <div className="setup-generator-overlay">
      <div className="setup-generator-modal">
        <div className="setup-generator-header">
          <h2>Generate Setup Files</h2>
          <ActionButton onClick={onClose} variant="secondary" size="sm">
            <MaterialIcon icon="close" size={20} color="var(--text)" className="hover-primary" />
          </ActionButton>
        </div>

        <div className="setup-generator-tabs">
          <button
            className={`tab-button ${activeTab === "bash" ? "active" : ""}`}
            onClick={() => setActiveTab("bash")}>
            🔧 setup.sh
          </button>
          <button
            className={`tab-button ${activeTab === "readme" ? "active" : ""}`}
            onClick={() => setActiveTab("readme")}>
            📖 README.md
          </button>
        </div>

        <div className="setup-generator-content">
          {activeTab === "bash" ? (
            <div className="file-preview">
              <div className="file-actions">
                <ActionButton onClick={() => copyToClipboard(bashScript)} variant="primary" size="sm">
                  📋 Copy
                </ActionButton>
                <ActionButton
                  onClick={() => downloadFile(bashScript, "setup.sh")}
                  variant="secondary"
                  size="sm">
                  💾 Download
                </ActionButton>
              </div>
              <pre className="code-preview">
                <code>{bashScript}</code>
              </pre>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-actions">
                <ActionButton onClick={() => copyToClipboard(readmeContent)} variant="primary" size="sm">
                  📋 Copy
                </ActionButton>
                <ActionButton
                  onClick={() => downloadFile(readmeContent, "README.md")}
                  variant="secondary"
                  size="sm">
                  💾 Download
                </ActionButton>
              </div>
              <pre className="code-preview">
                <code>{readmeContent}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
