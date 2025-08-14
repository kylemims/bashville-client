// import { useEffect } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const PageTemplate = () => {
  useDocumentTitle("Home • BASH STASH");

  return (
    <main id="main-content" role="main" aria-labelledby="page-title" className="mt-4">
      <h1 id="page-title" className="text-2xl mb-4">
        Page Title
      </h1>

      <section className="page-card">
        <h2 className="text-xl mb-2">Section Heading</h2>
        <p className="text-base">Your content here…</p>
      </section>
    </main>
  );
};
