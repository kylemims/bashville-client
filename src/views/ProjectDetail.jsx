import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getProjectById, updateProject } from "../services/projectService";
import { getCommands } from "../services/commandService";
import { getColorPalettes } from "../services/colorPaletteService";
import { CommandsTab } from "../components/CommandsTab";
import { ColorsTab } from "../components/ColorsTab";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { ActionButton } from "../components/ActionButton";
import { ROUTES } from "../utils/constants";

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    project: null,
    availableCommands: [],
    availablePalettes: [],
    loading: true,
    error: null,
    activeTab: "commands",
  });

  useDocumentTitle(state.project ? `${state.project.title} • Bash Stash` : "Project • Bash Stash");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, commandsData, palettesData] = await Promise.all([
          getProjectById(projectId),
          getCommands(),
          getColorPalettes(),
        ]);

        setState((prev) => ({
          ...prev,
          project: projectData,
          availableCommands: commandsData,
          availablePalettes: palettesData,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveProject = async (updatedData) => {
    try {
      const savedProject = await updateProject(projectId, updatedData);
      updateState({ project: savedProject });
      return savedProject;
    } catch (err) {
      throw new Error(`Failed to save project: ${err.message}`);
    }
  };

  if (state.loading) {
    return (
      <div className="page-content">
        <LoadingSpinner size="lg" text="Loading project..." />
      </div>
    );
  }

  if (state.error || !state.project) {
    return (
      <div className="page-content">
        <div className="page-card">
          <ErrorMessage message={state.error || "Project not found"} />
          <ActionButton onClick={() => navigate(ROUTES.DASHBOARD)} variant="primary">
            Back to Dashboard
          </ActionButton>
        </div>
      </div>
    );
  }

  const tabProps = {
    project: state.project,
    onSave: handleSaveProject,
  };

  return (
    <div className="page-content">
      <ProjectHeader title={state.project.title} onBack={() => navigate(ROUTES.DASHBOARD)} />

      <ProjectTabs activeTab={state.activeTab} onTabChange={(tab) => updateState({ activeTab: tab })} />

      <div className="tab-content">
        {state.activeTab === "commands" ? (
          <CommandsTab
            {...tabProps}
            availableCommands={state.availableCommands}
            onCommandsUpdate={(commands) => updateState({ availableCommands: commands })}
          />
        ) : (
          <ColorsTab
            {...tabProps}
            availablePalettes={state.availablePalettes}
            onPalettesUpdate={(palettes) => updateState({ availablePalettes: palettes })}
          />
        )}
      </div>
    </div>
  );
};

const ProjectHeader = ({ title, onBack }) => (
  <div className="project-header">
    <ActionButton onClick={onBack} variant="back" aria-label="Back to Dashboard">
      ←
    </ActionButton>
    <h1 className="project-title">&lt;{title} /&gt;</h1>
  </div>
);

const ProjectTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: "commands", label: "Commands" },
    { key: "colors", label: "Colors" },
  ];

  return (
    <div className="project-tabs">
      {tabs.map((tab) => (
        <ActionButton
          key={tab.key}
          variant={activeTab === tab.key ? "tab-active" : "tab"}
          onClick={() => onTabChange(tab.key)}>
          {tab.label}
        </ActionButton>
      ))}
    </div>
  );
};
