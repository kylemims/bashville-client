import { API_BASE_URL } from "../utils/constants.js";

const getToken = () => {
  // Development: Use env token
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  // Production: Use localStorage
  return localStorage.getItem("bashville_auth_token") || "";
};

export const getCommands = (token = getToken()) => {
  return fetch(`${API_BASE_URL}/commands`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch commands");
    }
    return res.json();
  });
};

export const createCommand = (commandData, token = getToken()) => {
  return fetch(`${API_BASE_URL}/commands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(commandData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create command");
    }
    return res.json();
  });
};

export const updateCommand = (commandId, commandData, token = getToken()) => {
  return fetch(`${API_BASE_URL}/commands/${commandId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(commandData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to update command");
    }
    return res.json();
  });
};

export const deleteCommand = (commandId, token = getToken()) => {
  return fetch(`${API_BASE_URL}/commands/${commandId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete command");
    }
    return res.ok;
  });
};
