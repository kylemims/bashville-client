const API_URL = "http://localhost:8000";

export const getColorPalettes = (token) => {
  return fetch(`${API_URL}/colorpalettes`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch palettes");
    return res.json();
  });
};
