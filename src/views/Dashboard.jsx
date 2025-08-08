import { useEffect, useState } from "react";
import { getColorPalettes } from "../services/api";

export default function Dashboard() {
  const [palettes, setPalettes] = useState([]);
  const [error, setError] = useState(null);

  // 👇 Replace with your real token for now
  const token = "481744eba6ed9bad5ad77d74e36f7c054e398dd3";

  useEffect(() => {
    getColorPalettes(token)
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
}
