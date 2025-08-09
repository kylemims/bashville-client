import { useEffect, useState } from "react";
import { getColorPalettes } from "../services/api";
import { USER_TOKEN } from "../services/api";

export const Dashboard = () => {
  const [palettes, setPalettes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getColorPalettes(USER_TOKEN)
      .then((data) => setPalettes(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🎨 Your Color Palettes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {palettes.map((palette) => (
          <li key={palette.id}>
            <strong>{palette.name}</strong>:{palette.primary_hex}, {palette.secondary_hex},{" "}
            {palette.accent_hex}, {palette.background_hex}
          </li>
        ))}
      </ul>
    </main>
  );
};
