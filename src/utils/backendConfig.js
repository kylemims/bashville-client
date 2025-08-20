// src/utils/backendConfig.js
const KEY = (projectId) => `bashville_backend_${projectId}`;

export function getBackendConfig(projectId) {
  try {
    const raw = localStorage.getItem(KEY(projectId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setBackendConfig(projectId, config) {
  localStorage.setItem(KEY(projectId), JSON.stringify(config || {}));
}

export function clearBackendConfig(projectId) {
  localStorage.removeItem(KEY(projectId));
}
