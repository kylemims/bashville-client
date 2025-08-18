// src/views/HomePage.jsx
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ActionButton } from "../components/common/ActionButton.jsx";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Assuming you have some styles for the HomePage

export const HomePage = () => {
  useDocumentTitle("Home • BASH STASH");
  const navigate = useNavigate();

  return (
    <main id="page-content" role="main" aria-labelledby="page-title" className="mt-4 page-enter">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">Welcome to Bash Stash</h1>
          <p className="hero-subtext">Launch projects faster.</p>
          <div className="hero-ctas">
            <ActionButton label="Go to Dashboard" onClick={() => navigate("/dashboard")} variant="secondary">
              GO TO DASHBOARD
            </ActionButton>{" "}
            <ActionButton
              label="Create New Project"
              onClick={() => navigate("/projects/new")}
              variant="accent">
              CREATE NEW PROJECT
            </ActionButton>
          </div>
        </div>
        <div className="hero-graphic">
          <img src="/assets/images/bashed-logo.svg" alt="Bash Stash Hero" className="hero-image" />
        </div>
      </section>
      <section className="features-section">
        <h2>Why Bash Stash?</h2>
        <div className="feature-cards">
          {/* Reuse ProjectCard or make simple cards */}
          <div className="feature-card">Stash Commands: Save and reuse CLI magic.</div>
          <div className="feature-card">Color Palettes: Theme projects instantly.</div>
          <div className="feature-card">One-Click Scripts: Generate bash and README.</div>
        </div>
      </section>
    </main>
  );
};
//       <section className="page-card" style={{ maxWidth: "1000px", margin: "0 auto" }}>
//         <h2 className="text-xl mb-2">Launch projects faster.</h2>
//         <p className="text-base mb-4">
//           Spin up templates, stash your favorite commands, and bootstrap README + bash scripts.
//         </p>
//         <div className="flex gap-4">
//           <a href="/dashboard" className="button">
//             Go to Dashboard
//           </a>
//           <a href="/projects/new" className="button secondary">
//             Create New Project
//           </a>
//         </div>
//       </section>
//     </main>
//   );
// };
