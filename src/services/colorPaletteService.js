// Color Palette Service

import { API_BASE_URL } from "../utils/constants.js";

const getToken = () => {
  // Development: Use env token
  if (process.env.REACT_APP_USER_TOKEN) {
    return process.env.REACT_APP_USER_TOKEN;
  }
  // Production: Use localStorage
  return localStorage.getItem("bashville_auth_token") || "";
};

export const getColorPalettes = (token = getToken()) => {
  return fetch(`${API_BASE_URL}/color-palettes`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch color palettes");
    }
    return res.json();
  });
};

export const createColorPalette = (paletteData, token = getToken()) => {
  return fetch(`${API_BASE_URL}/color-palettes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(paletteData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create color palette");
    }
    return res.json();
  });
};

export const updateColorPalette = (paletteId, paletteData, token = getToken()) => {
  return fetch(`${API_BASE_URL}/color-palettes/${paletteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(paletteData),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to update color palette");
    }
    return res.json();
  });
};

export const deleteColorPalette = (paletteId, token = getToken()) => {
  return fetch(`${API_BASE_URL}/color-palettes/${paletteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete color palette");
    }
    return res.ok;
  });
};
