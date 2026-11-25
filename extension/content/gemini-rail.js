/**
 * Detect and hide Google's left AI Mode / Gemini rail (gold G, chat history).
 * Selectors drift; we combine class hints, Gemini links, and aria-labels.
 */
(() => {
  const RESULTS_SELECTOR = "#center_col, #search, #rso, #searchform";
  const GEMINI_HREF = /(?:gemini|bard)\.google|[?&]udm=50(?:&|$)/i;
  const ARIA_GEMINI =
    /\b(gemini|ai\s*mode)\b|new\s+chat|chat\s+history|start\s+chat/i;

  const containsResults = (el) =>
    el?.matches?.(RESULTS_SELECTOR) ||
    Boolean(el?.querySelector?.(RESULTS_SELECTOR));

  function climbToRailRoot(start) {
    let el = start;
    let candidate = start;

    while (el?.parentElement && el.parentElement !== document.documentElement) {
      const parent = el.parentElement;
      if (containsResults(parent)) break;

      const rect = parent.getBoundingClientRect();
      const narrowSideRail =
        rect.width > 0 &&
        rect.width <= 140 &&
        rect.left < 100 &&
        rect.height > 200;

      if (
        parent.classList.contains("gwi4t") ||
        parent.querySelector?.(".gwi4t, [class*='gwi4']") ||
        narrowSideRail
      ) {
        candidate = parent;
      }
      el = parent;
    }
    return candidate;
  }

  function isSafeRailRoot(el) {
    if (!el || containsResults(el)) return false;
    if (el.querySelector("a[href] h3, .g, .yuRUbf")) return false;
    return true;
  }

  function collectGeminiRails() {
    const roots = new Set();

    const consider = (node) => {
      const root = climbToRailRoot(node);
      if (isSafeRailRoot(root)) roots.add(root);
    };

    document.querySelectorAll(".gwi4t, [class*='gwi4']").forEach(consider);

    document.querySelectorAll("a[href]").forEach((link) => {
      if (!GEMINI_HREF.test(link.getAttribute("href") || "")) return;
      if (link.closest("#rso, #center_col, [role='navigation']")) return;
      consider(link);
    });

    document.querySelectorAll("[aria-label]").forEach((el) => {
      if (!ARIA_GEMINI.test(el.getAttribute("aria-label") || "")) return;
      if (el.closest("#rso, #center_col")) return;
      consider(el);
    });

    document
      .querySelectorAll('img[alt*="Gemini" i], svg[aria-label*="Gemini" i]')
      .forEach((el) => {
        if (el.closest("#rso, #center_col")) return;
        consider(el);
      });

    return [...roots];
  }

  globalThis.SEARCH_BEFORE_AI_collectGeminiRails = collectGeminiRails;
})();