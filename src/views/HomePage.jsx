// src/views/HomePage.jsx
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const HomePage = () => {
  useDocumentTitle("Home • BASH STASH");

  return (
    <main id="main-content" role="main" aria-labelledby="page-title" className="mt-4">
      <h1 id="page-title" className="text-2xl mb-4">
        Welcome to Bash Stash
      </h1>

      {/* Hero-style area — wide layout handled by Wrapper prop in App.jsx */}
      <section className="page-card" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 className="text-xl mb-2">Launch projects faster.</h2>
        <p className="text-base mb-4">
          Spin up templates, stash your favorite commands, and bootstrap README + bash scripts.
        </p>
        <div className="flex gap-4">
          <a href="/dashboard" className="button">
            Go to Dashboard
          </a>
          <a href="/projects/new" className="button secondary">
            Create New Project
          </a>
        </div>
      </section>
    </main>
  );
};
