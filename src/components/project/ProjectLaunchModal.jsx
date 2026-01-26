import { useState, useEffect } from "react";
import { generateCodeForProject } from "../../services/codeGenService.js";
import { generateBashScript } from "../../utils/generateBashScript.js";
import { generateReadme } from "../../utils/generateReadme.js";
import { copyToClipboard } from "../../utils/copyToClipboard.js";
import { downloadFile } from "../../utils/downloadFile.js";
import { MaterialIcon } from "../common/MaterialIcon.jsx";
import { ActionButton } from "../common/ActionButton.jsx";
import { LoadingSpinner } from "../common/LoadingSpinner.jsx";
import { ErrorMessage } from "../common/ErrorMessage.jsx";
import { FileTree } from "./FileTree.jsx";
import { FilePreview } from "./FilePreview.jsx";
import { ProjectDownloader } from "./ProjectDownloader.jsx";
import "./ProjectLaunchModal.css";

export const ProjectLaunchModal = ({ project, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("bash");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);

  const handleGenerateFullProject = async () => {
    if (!project?.id) {
      setError("No project selected for generation");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Generating project files for project ID:", project.id);
      const result = await generateCodeForProject(project.id);
      console.log("Generation result:", result);

      setGenerationResult(result);

      // Auto-select the first file for preview
      if (result.files && result.files.length > 0) {
        setSelectedFile(result.files[0].path);
      }
    } catch (err) {
      console.error("Generation failed:", err);
      setError(`Failed to generate project: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate files when Files tab is clicked
  useEffect(() => {
    if (isOpen && activeTab === "files" && !generationResult && !isGenerating) {
      handleGenerateFullProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  // Generate bash script and README (always available)
  const bashScript = generateBashScript(project);
  const readmeContent = generateReadme(project);

  const handleCopy = async (content, type) => {
    try {
      await copyToClipboard(content);
      setCopyStatus(type);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleDownload = (content, filename) => {
    try {
      downloadFile(content, filename);
      setDownloadStatus(filename);
      setTimeout(() => setDownloadStatus(null), 3000);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file.path);
  };

  const handleDownloadComplete = (projectName) => {
    console.log(`Downloaded project: ${projectName}`);
  };

  const handleClose = () => {
    setGenerationResult(null);
    setSelectedFile(null);
    setError(null);
    setActiveTab("bash");
    setCopyStatus(null);
    setDownloadStatus(null);
    onClose();
  };

  const getSelectedFileContent = () => {
    if (!selectedFile || !generationResult?.files) return null;
    return generationResult.files.find((f) => f.path === selectedFile);
  };

  const renderBashScriptTab = () => (
    <div className="script-preview-container">
      <div className="script-header">
        <div className="script-info">
          <h3>
            <MaterialIcon icon="terminal" size={20} color="var(--color-primary)" />
            Setup Script
          </h3>
          <p>Copy this script and save as setup.sh, then run chmod +x setup.sh && ./setup.sh</p>
        </div>

        <div className="script-actions">
          <ActionButton onClick={() => handleCopy(bashScript, "bash")} variant="primary" size="sm">
            <MaterialIcon icon="content_copy" size={16} />
            {copyStatus === "bash" ? "Copied!" : "Copy"}
          </ActionButton>
          <ActionButton onClick={() => handleDownload(bashScript, "setup.sh")} variant="secondary" size="sm">
            <MaterialIcon icon="download" size={16} />
            Download
          </ActionButton>
        </div>
      </div>

      {(copyStatus === "bash" || downloadStatus === "setup.sh") && (
        <div className="action-feedback success">
          <MaterialIcon icon="check_circle" size={16} color="var(--color-accent)" />
          <span>
            {copyStatus === "bash" && "Copied to clipboard!"}
            {downloadStatus === "setup.sh" && "Downloaded! Run: chmod +x setup.sh && ./setup.sh"}
          </span>
        </div>
      )}

      <pre className="script-content">
        <code>{bashScript}</code>
      </pre>

      <div className="readme-section">
        <div className="readme-header">
          <h3>
            <MaterialIcon icon="description" size={20} color="var(--color-secondary)" />
            README.md
          </h3>
          <div className="readme-actions">
            <ActionButton onClick={() => handleCopy(readmeContent, "readme")} variant="primary" size="sm">
              <MaterialIcon icon="content_copy" size={16} />
              {copyStatus === "readme" ? "Copied!" : "Copy"}
            </ActionButton>
            <ActionButton
              onClick={() => handleDownload(readmeContent, "README.md")}
              variant="secondary"
              size="sm">
              <MaterialIcon icon="download" size={16} />
              Download
            </ActionButton>
          </div>
        </div>

        {(copyStatus === "readme" || downloadStatus === "README.md") && (
          <div className="action-feedback success">
            <MaterialIcon icon="check_circle" size={16} color="var(--color-accent)" />
            <span>
              {copyStatus === "readme" && "README copied to clipboard!"}
              {downloadStatus === "README.md" && "README.md downloaded!"}
            </span>
          </div>
        )}

        <pre className="readme-content">
          <code>{readmeContent}</code>
        </pre>
      </div>
    </div>
  );

  const renderFilesTab = () => {
    if (!generationResult) {
      return (
        <div className="generate-prompt">
          <div className="prompt-content">
            <LoadingSpinner size="lg" />
            <h3>Generating Project Files...</h3>
            <p>
              Please wait while we create your complete React project with all components and configurations.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="file-explorer">
        <div className="file-tree-panel">
          <FileTree
            files={generationResult.files || []}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        </div>

        <div className="file-preview-panel">
          {selectedFile ?
            <FilePreview filename={selectedFile} content={getSelectedFileContent()?.content || ""} />
          : <div className="no-file-selected">
              <MaterialIcon icon="description" size={48} color="var(--muted)" />
              <p>Select a file to preview its content</p>
            </div>
          }
        </div>
      </div>
    );
  };

  const renderDownloadTab = () => {
    if (!generationResult) {
      return (
        <div className="download-unavailable">
          <MaterialIcon icon="folder_zip" size={64} color="var(--muted)" />
          <h3>Generate Project First</h3>
          <p>Switch to the "File Preview" tab to generate the complete project and enable download.</p>
          <ActionButton variant="primary" size="md" onClick={() => setActiveTab("files")}>
            <MaterialIcon icon="auto_fix_high" size={16} />
            Go to File Preview Tab
          </ActionButton>
        </div>
      );
    }

    return (
      <ProjectDownloader
        project={project}
        files={generationResult.files || []}
        setupInstructions={generationResult.setup_instructions || { message: "", steps: [] }}
        onDownloadComplete={handleDownloadComplete}
      />
    );
  };

  return (
    <div
      className="modal-overlay project-launch-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-container project-launch-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>
              <MaterialIcon icon="rocket_launch" size={24} color="var(--color-primary)" />
              {project.title}
            </h2>
          </div>
          <ActionButton onClick={handleClose} variant="secondary" size="xs">
            <MaterialIcon icon="close" size={20} />
          </ActionButton>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === "bash" ? "active" : ""}`}
            onClick={() => setActiveTab("bash")}>
            <MaterialIcon icon="terminal" size={16} />
            Bash Script
          </button>
          <button
            className={`tab ${activeTab === "files" ? "active" : ""}`}
            onClick={() => setActiveTab("files")}>
            <MaterialIcon icon="code" size={16} />
            File Preview {generationResult && `(${generationResult.files?.length || 0})`}
          </button>
          <button
            className={`tab ${activeTab === "download" ? "active" : ""}`}
            onClick={() => setActiveTab("download")}>
            <MaterialIcon icon="download" size={16} />
            Download
          </button>
        </div>

        <div className="modal-content tab-content">
          {activeTab === "bash" && renderBashScriptTab()}
          {activeTab === "files" && renderFilesTab()}
          {activeTab === "download" && renderDownloadTab()}
        </div>
      </div>
    </div>
  );
};
