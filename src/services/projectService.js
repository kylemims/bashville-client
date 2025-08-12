import { getToken } from "./auth.js";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getProjects = (token = getToken()) => {
  return fetch(`${API_URL}/projects`, {
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
