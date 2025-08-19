// src/services/codeGenService.js

import { API_BASE_URL } from "../utils/constants.js";

const getToken = () => {
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  return localStorage.getItem("bashville_auth_token") || "";
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem("bashville_auth_token");
    localStorage.removeItem("bashville_user_data");
    window.location.href = "/login";
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (parseError) {
      console.warn("Could not parse error response:", parseError);
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const generateCode = async (prompt) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/codegen/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });

  return handleResponse(response);
};

export const downloadGeneratedCode = async (codeId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/codegen/download/${codeId}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download generated code`);
  }
  return response.blob();
};
