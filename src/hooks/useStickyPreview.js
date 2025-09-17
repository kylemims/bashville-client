import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for advanced sticky preview behavior
 * Provides smooth scrolling alignment with target elements
 */
export const useStickyPreview = (targetSelector = ".advanced-style-controls") => {
  const previewRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [topOffset, setTopOffset] = useState(16); // Default 1rem

  useEffect(() => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    const handleScroll = () => {
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;

      const previewRect = previewElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate if we should be sticky
      const shouldBeSticky = previewRect.top <= 16;
      setIsSticky(shouldBeSticky);

      // Calculate dynamic top offset to align with target
      if (shouldBeSticky && targetRect.top > 0 && targetRect.top < viewportHeight) {
        // Smoothly adjust top position to align with target
        const newTopOffset = Math.max(16, Math.min(targetRect.top - 20, 100));
        setTopOffset(newTopOffset);
      } else {
        setTopOffset(16); // Reset to default
      }
    };

    // Throttled scroll handler for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll);
    window.addEventListener("resize", handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [targetSelector]);

  return {
    previewRef,
    isSticky,
    topOffset,
    style: {
      position: "sticky",
      top: `${topOffset}px`,
      transition: "top 0.2s ease",
      zIndex: 10,
    },
  };
};
