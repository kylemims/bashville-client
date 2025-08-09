const API_URL = "http://localhost:8000";
const USER_TOKEN = process.env.REACT_APP_USER_TOKEN;

export const getColorPalettes = () => {
  return fetch(`${API_URL}/colorpalettes`, {
    headers: {
      Authorization: `Token ${USER_TOKEN}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch palettes");
    return res.json();
  });
};

export { USER_TOKEN };
