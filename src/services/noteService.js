import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";

// Helper function to get authentication token
const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log("📡 Response status:", response.status);
  console.log("📡 Response URL:", response.url);

  if (response.status === 401) {
    // Token expired or invalid - trigger logout
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    window.location.href = "/login";
    throw new Error("Authentication failed");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData,
    });
    throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

// Helper function to build query parameters
const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });

  return searchParams.toString();
};

// Get all notes with optional filtering and pagination
export const getNotes = async (filters = {}) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const queryString = buildQueryParams(filters);
  const url = `${API_BASE_URL}/notes${queryString ? `?${queryString}` : ""}`;

  console.log("🔍 Requesting Notes URL:", url);
  console.log("🔑 Using token:", token ? "✅ Token present" : "❌ No token");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Get a single note by ID
export const getNote = async (noteId) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Create a new note
export const createNote = async (noteData) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  return handleResponse(response);
};

// Create a quick note (minimal data)
export const createQuickNote = async (content, projectId = null) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const quickNoteData = {
    content,
    project: projectId,
  };

  const response = await fetch(`${API_BASE_URL}/notes/quick_create`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quickNoteData),
  });

  return handleResponse(response);
};

// Update an existing note
export const updateNote = async (noteId, noteData) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  return handleResponse(response);
};

// Partially update a note (PATCH)
export const patchNote = async (noteId, partialData) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(partialData),
  });

  return handleResponse(response);
};

// Delete a note
export const deleteNote = async (noteId) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 204) {
    return { success: true };
  }

  return handleResponse(response);
};

// Search notes with advanced syntax
export const searchNotes = async (query) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/search`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return handleResponse(response);
};

// Get note statistics
export const getNoteStats = async (projectId = null) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const params = projectId ? { project: projectId } : {};
  const queryString = buildQueryParams(params);
  const url = `${API_BASE_URL}/notes/stats${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Get notes by category
export const getNotesByCategory = async (category) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/by_category`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Get notes by project
export const getNotesByProject = async (projectId) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/by_project`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Get recent notes
export const getRecentNotes = async (limit = 10) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/recent/?limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Toggle note completion status
export const toggleNoteCompletion = async (noteId) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}/toggle_completion`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Archive/unarchive a note
export const toggleNoteArchived = async (noteId) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}/toggle_pin`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Mark note as important/unimportant
export const toggleNoteImportant = async (noteId) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}/toggle_pin`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// Bulk operations
export const bulkDeleteNotes = async (noteIds) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/bulk_actions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note_ids: noteIds }),
  });

  return handleResponse(response);
};

export const bulkArchiveNotes = async (noteIds) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/bulk_actions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note_ids: noteIds }),
  });

  return handleResponse(response);
};

export const bulkCompleteNotes = async (noteIds) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token");

  const response = await fetch(`${API_BASE_URL}/notes/bulk_actions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note_ids: noteIds }),
  });

  return handleResponse(response);
};

// Export functions for easier access
const noteService = {
  getNotes,
  getNote,
  createNote,
  createQuickNote,
  updateNote,
  patchNote,
  deleteNote,
  searchNotes,
  getNoteStats,
  getNotesByCategory,
  getNotesByProject,
  getRecentNotes,
  toggleNoteCompletion,
  toggleNoteArchived,
  toggleNoteImportant,
  bulkDeleteNotes,
  bulkArchiveNotes,
  bulkCompleteNotes,
};

export default noteService;
