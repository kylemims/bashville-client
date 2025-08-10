// src/services/api.js
import { getToken } from "./auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getColorPalettes = (token = getToken()) => {
  return fetch(`${API_URL}/colorpalettes`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch palettes");
    return res.json();
  });
};

export { API_URL };
