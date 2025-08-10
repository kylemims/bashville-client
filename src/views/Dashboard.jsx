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
    <main id="main-content" role="main" aria-labelledby="page-title" className="mt-4">
      <h1 id="page-title" className="text-2xl mb-4">
        Your Projects
      </h1>

      {/* Showing palettes until Project.jsx is ready */}
      <section className="page-card">
        <h2 className="text-xl mb-2 card-title">Project Name</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul className="mt-2">
          {palettes.map((p) => (
            <li key={p.id} className="mb-2">
              <strong>{p.name}</strong>: {p.primary_hex}, {p.secondary_hex}, {p.accent_hex},{" "}
              {p.background_hex}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};
