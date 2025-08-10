// src/hooks/useDocumentTitle.js
import { useEffect } from "react";

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
};
