// src/components/HomePage/FutureSneakPeek.jsx
import { ActionButton } from "../common/ActionButton.jsx";
import "./FutureSneakPeek.css";

export const FutureSneakPeek = () => {
  const templates = [
    { id: "crud-django", title: "Django CRUD Starter", tags: ["API", "Auth", "DRF"] },
    { id: "react-tailwind", title: "React + Tailwind Dashboard", tags: ["UI", "Charts"] },
    {
      id: "saas-min",
      title: "Mini SaaS Boilerplate",
      tags: ["Users", "Billing"],
      image: "assets/images/vivid3.png",
    },
  ];

  const palettes = [
    { id: "neon-dusk", name: "Neon Dusk", swatches: ["#1f2937", "#3b82f6", "#f59e0b", "#0b0f1a"] },
    { id: "pastel-fresh", name: "Pastel Fresh", swatches: ["#222222", "#7dd3fc", "#a7f3d0", "#fef9c3"] },
    { id: "midnight-ink", name: "Midnight Ink", swatches: ["#0b1220", "#64748b", "#22d3ee", "#0ea5e9"] },
  ];

  return (
    <section className="future-sneak">
      <div className="future-head">
        <span className="badge">Coming Soon</span>
        <h2 className="future-title">Weekly Templates & Palettes</h2>
        <p className="future-sub">
          Fresh starter kits and color sets every week to keep you building fast and having fun.
        </p>
      </div>

      {/* Templates */}
      <div className="future-block">
        <div className="future-block-head">
          <h3>Featured Weekly Templates</h3>
          <ActionButton size="sm" variant="accent" onClick={() => (window.location.href = "/templates")}>
            View All
          </ActionButton>
        </div>

        <div className="future-cards">
          {templates.map((t) => (
            <article key={t.id} className="future-card">
              <div className="card-thumb card-thumb--template">
                <img className="card-image" src={t.image} alt="" />
              </div>
              <div className="card-body">
                <h4 className="card-title">{t.title}</h4>
                <div className="card-tags">
                  {t.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="card-actions">
                  <ActionButton size="xs" variant="primary" disabled title="Demo build (soon)">
                    Try Template
                  </ActionButton>
                  <ActionButton size="xs" variant="tab" onClick={() => (window.location.href = "/templates")}>
                    Learn More
                  </ActionButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Palettes */}
      <div className="future-block">
        <div className="future-block-head">
          <h3>Palettes of the Week</h3>
          <ActionButton size="sm" variant="accent" onClick={() => (window.location.href = "/palettes")}>
            Explore Palettes
          </ActionButton>
        </div>

        <div className="palette-grid">
          {palettes.map((p) => (
            <article key={p.id} className="palette-card">
              <div className="palette-swatches" aria-label={`${p.name} swatches`}>
                {p.swatches.map((hex, i) => (
                  <div key={hex + i} className="swatch" style={{ background: hex }} title={hex} />
                ))}
              </div>
              <div className="palette-meta">
                <h4 className="palette-name">{p.name}</h4>
                <code className="palette-hexes">{p.swatches.join("  ")}</code>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="future-cta">
        <h3>Want early access?</h3>
        <p>Templates and palettes will roll out soon. Be first to try them.</p>
        <ActionButton size="sm" variant="primary" onClick={() => (window.location.href = "/signup")}>
          Get Notified
        </ActionButton>
      </div>
    </section>
  );
};
