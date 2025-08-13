import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getProjectById, updateProject } from "../services/projectService";
import { getCommands } from "../services/commandService";
import { getColorPalettes } from "../services/colorPaletteService";
import { CommandsTab } from "../components/tabs/CommandsTab";
import { ColorsTab } from "../components/tabs/ColorsTab";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { ActionButton } from "../components/common/ActionButton";
import { ProjectHeader } from "../components/project/ProjectHeader";
import { ProjectTabs } from "../components/project/ProjectTabs";
import { SetupGenerator } from "../components/project/SetupGenerator.jsx";
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
  const [showSetupGenerator, setShowSetupGenerator] = useState(false);
  useDocumentTitle(state.project ? `${state.project.title} • Bash Stash` : "Project • Bash Stash");
  const handleGenerateSetup = () => {
    setShowSetupGenerator(true);
  };
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
      console.log("Saving project with data:", updatedData);
      console.log("Project ID:", projectId);

      const updatedProject = await updateProject(projectId, updatedData);
      console.log("Project updated successfully:", updatedProject);

      // Update the local state with the new project data
      updateState({ project: updatedProject });

      return updatedProject;
    } catch (error) {
      console.error("Failed to save project:", error);
      throw new Error(`Failed to save project: ${error.message}`);
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
      <div className="project-detail">
        <ProjectHeader
          title={state.project.title}
          onBack={() => navigate(ROUTES.DASHBOARD)}
          onGenerateSetup={handleGenerateSetup}
        />

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
          {showSetupGenerator && (
            <SetupGenerator project={state.project} onClose={() => setShowSetupGenerator(false)} />
          )}
        </div>
      </div>
    </div>
  );
};
