// src/ApplicationViews.jsx
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./views/HomePage";
import { Dashboard } from "./views/Dashboard";
import { PageTemplate } from "./views/PageTemplate";

export const ApplicationViews = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/template" element={<PageTemplate />} />
      {/* soon:
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/new" element={<ProjectForm />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
      */}
    </Routes>
  );
};
