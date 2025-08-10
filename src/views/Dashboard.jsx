// src/views/Dashboard.jsx
import { useEffect, useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getColorPalettes } from "../services/api";

export const Dashboard = () => {
  useDocumentTitle("Dashboard • Bash Stash");

  const [palettes, setPalettes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getColorPalettes()
      .then(setPalettes)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page-content">
      <h1 className="text-2xl mb-6">Your Projects</h1>

      <div className="page-card">
        <h2 className="card-title">Project Name</h2>
        {error && <p style={{ color: "var(--color-secondary)" }}>{error}</p>}

        <ul className="mt-4">
          {palettes.map((p) => (
            <li
              key={p.id}
              className="mb-3 p-3"
              style={{ background: "var(--bg-input)", borderRadius: "8px" }}>
              <strong style={{ color: "var(--color-primary)" }}>{p.name}</strong>
              <br />
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {p.primary_hex} • {p.secondary_hex} • {p.accent_hex} • {p.background_hex}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
