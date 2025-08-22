// import { useState } from "react";
// import { copyToClipboard } from "../utils/copyToClipboard";
// import { createCommand } from "../services/commandService";
// import { ActionButton } from "../components/common/ActionButton";

// const RECIPES = [
//   {
//     title: "Write .gitignore",
//     code: "cat > .gitignore <<'EOF'\n__pycache__/\n*.pyc\n*.sqlite3\n.env\nnode_modules/\ndist/\n.vscode/\n.DS_Store\nEOF",
//   },
//   {
//     title: "Init Git",
//     code: 'git init && git add . && git commit -m "init"',
//   },
//   {
//     title: "Run Server (auto-port)",
//     code:
//       "PORT=\nfor p in 8000 8001 8002; do\n  if ! lsof -i :$p >/dev/null 2>&1; then PORT=$p; break; fi\n" +
//       'done\nif [ -z "$PORT" ]; then echo "❌ No free port (8000–8002)"; exit 1; fi\n' +
//       'echo "🌐 Starting on http://127.0.0.1:$PORT"\n' +
//       "pipenv run python manage.py runserver 127.0.0.1:$PORT",
//   },
// ];

// export const FeaturesShowcase = () => {
//   const [busyId, setBusyId] = useState(null);
//   const [status, setStatus] = useState("");

//   const handleCopy = async (code) => {
//     await copyToClipboard(code);
//     setStatus("Copied!");
//     setTimeout(() => setStatus(""), 1500);
//   };

//   const handleAddToStash = async (recipe) => {
//     try {
//       setBusyId(recipe.title);
//       await createCommand({ label: recipe.title, command_text: recipe.code });
//       setStatus("Added to Stash ✅");
//     } catch (e) {
//       setStatus(`Failed: ${e.message}`);
//     } finally {
//       setBusyId(null);
//       setTimeout(() => setStatus(""), 2000);
//     }
//   };

//   return (
//     <section className="why-wrap">
//       <div className="why-head">
//         <h1 className="page-title">Starter Recipes</h1>
//         {status && <div className="banner">{status}</div>}
//         <div className="why-grid">
//           {RECIPES.map((r) => (
//             <div key={r.title} className="why-card">
//               <div className="why-cta-row">
//                 <h3>{r.title}</h3>
//                 <div className="actions">
//                   <ActionButton size="xs" variant="primary" onClick={() => handleCopy(r.code)}>
//                     Copy
//                   </ActionButton>
//                   <ActionButton
//                     size="xs"
//                     variant="secondary"
//                     onClick={() => handleAddToStash(r)}
//                     disabled={busyId === r.title}>
//                     {busyId === r.title ? "Adding…" : "Add to Stash"}
//                   </ActionButton>
//                 </div>
//               </div>
//               <pre className="code">
//                 <code>{r.code}</code>
//               </pre>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
import { useState } from "react";
import "./FeaturesShowcase.css";

// tiny inline SVGs (no external icon libs)
const SparkIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 2l1.9 5.8h6.1l-4.9 3.6 1.9 5.8L12 13.6 7 17.2l1.9-5.8L4 7.8h6.1z" />
  </svg>
);
const PlugIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M7 2h2v6h6V2h2v6h3v2h-3v3.5A6.5 6.5 0 0 1 7.5 20H4v-2h3.5A4.5 4.5 0 0 0 12 13.5V10H7z"
    />
  </svg>
);
const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 2l8 3v7c0 5-3.4 9.7-8 10-4.6-.3-8-5-8-10V5l8-3z" />
  </svg>
);

export const FeaturesShowcase = () => {
  // optional: quick copy feedback for template snippet buttons
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  // small “weekly template” teaser items (these are placeholders—edit freely)
  const weeklyTemplates = [
    {
      key: "django-lite",
      title: "Django: Quickstart",
      blurb: "Startproject + DRF + CORS in one go.",
      cmd: "pipenv run django-admin startproject myproj . && pipenv run python manage.py startapp api",
    },
    {
      key: "node-api",
      title: "Node API Stub",
      blurb: "Express + nodemon + basic routes.",
      cmd: 'npm init -y && npm i express nodemon && echo "node server.js"',
    },
    {
      key: "git-essentials",
      title: "Git Essentials",
      blurb: "Init repo, write .gitignore, first commit.",
      cmd: "git init && echo 'node_modules/' >> .gitignore && git add . && git commit -m \"init\"",
    },
  ];

  return (
    <section className="fs-wrap" aria-labelledby="why-bash-heading">
      {/* Title row with subtle gradient line */}
      <header className="fs-head">
        <h2 id="why-bash-heading" className="fs-title">
          WHY BASH?
        </h2>
        <div className="fs-line" />
      </header>

      <p className="fs-sub">
        Bash Stash turns repeat setup steps into one‑click, human‑readable scripts. Less fumbling in
        terminals, more shipping projects.
      </p>

      {/* Feature cards */}
      <div className="fs-grid">
        <article className="fs-card">
          <div className="fs-card-head">
            <span className="fs-icon">
              <SparkIcon />
            </span>
            <h3 className="fs-card-title">Generate & Go</h3>
          </div>
          <p className="fs-card-text">
            Build a script from your <em>project commands</em>, color palette, and backend schema preview.
            Download it as <code>setup.sh</code> or copy in one click.
          </p>
        </article>

        <article className="fs-card">
          <div className="fs-card-head">
            <span className="fs-icon">
              <PlugIcon />
            </span>
            <h3 className="fs-card-title">Plays Nice with Django</h3>
          </div>
          <p className="fs-card-text">
            Your config becomes real code: models, serializers, routers. Add to your repo when you’re ready.
          </p>
        </article>

        <article className="fs-card">
          <div className="fs-card-head">
            <span className="fs-icon">
              <ShieldIcon />
            </span>
            <h3 className="fs-card-title">Safe by Default</h3>
          </div>
          <p className="fs-card-text">
            We don’t overwrite files blindly. The generated script checks for existing files first.
          </p>
        </article>
      </div>

      {/* Palette strip (fun visual flourish) */}
      <div className="fs-palette">
        <span className="fs-chip fs-chip--1" title="Primary" />
        <span className="fs-chip fs-chip--2" title="Secondary" />
        <span className="fs-chip fs-chip--3" title="Accent" />
        <span className="fs-chip fs-chip--4" title="Background" />
        <span className="fs-chip fs-chip--fade" />
      </div>

      {/* Weekly Templates teaser */}
      <div className="fs-templates">
        <div className="fs-templates-head">
          <h3 className="fs-templates-title">Weekly Templates (preview)</h3>
          <p className="fs-templates-sub">Tiny, copy‑ready snippets to kickstart common workflows.</p>
        </div>

        <div className="fs-templates-scroller">
          {weeklyTemplates.map((t) => (
            <div className="fs-tile" key={t.key}>
              <div className="fs-tile-top">
                <h4 className="fs-tile-title">{t.title}</h4>
                <p className="fs-tile-blurb">{t.blurb}</p>
              </div>
              <pre className="fs-tile-code">
                <code>{t.cmd}</code>
              </pre>
              <div className="fs-tile-actions">
                <button type="button" className="fs-btn fs-btn--primary" onClick={() => copy(t.cmd, t.key)}>
                  {copiedKey === t.key ? "Copied!" : "Copy command"}
                </button>
                <button
                  type="button"
                  className="fs-btn fs-btn--ghost"
                  onClick={() => alert("Add to Stash coming soon ✨")}>
                  Add to Stash
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
