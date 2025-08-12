import { API_BASE_URL } from "../utils/constants.js";

const getToken = () => {
  // Development: Use env token
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  // Production: Use localStorage
  return localStorage.getItem("bashville_auth_token") || "";
};

export const getProjects = (token = getToken()) => {
  return fetch(`${API_BASE_URL}/projects`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }
    return res.json();
  });
};

export const getProjectById = (projectId, token = getToken()) => {
  return fetch(`${API_BASE_URL}/projects/${projectId}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch project");
    }
    return res.json();
  });
};

export const createProject = (projectData, token = getToken()) => {
  return fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(projectData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create project");
    }
    return res.json();
  });
};

export const deleteProject = (projectId, token = getToken()) => {
  return fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete project");
    }
    return res.ok;
  });
};

export const updateProject = (projectId, projectData, token = getToken()) => {
  return fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(projectData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to update project");
    }
    return res.json();
  });
};
