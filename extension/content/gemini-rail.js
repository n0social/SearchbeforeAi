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

  function climbLeftDock(start) {
    let root = start;
    for (let i = 0; i < 10; i++) {
      const parent = root.parentElement;
      if (!parent || parent === document.documentElement) break;
      if (containsResults(parent)) break;
      const rect = parent.getBoundingClientRect();
      if (rect.width > 240 || rect.left > 96) break;
      root = parent;
    }
    return root;
  }

  /** Signed-out / new layouts: narrow full-height column with icon buttons on the far left. */
  function findLeftRailsByGeometry() {
    const roots = new Set();
    const viewportH = window.innerHeight || 800;

    for (const el of document.querySelectorAll(
      "a, button, [role='button'], [data-ved]",
    )) {
      if (el.closest("#rso, #center_col, #searchform, [role='navigation']")) {
        continue;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.left > 88) continue;
      if (rect.top > 200) continue;

      const root = climbLeftDock(el);
      const r = root.getBoundingClientRect();
      if (r.width < 28 || r.width > 220) continue;
      if (r.left > 80) continue;
      if (r.height < viewportH * 0.3) continue;
      if (!isSafeRailRoot(root)) continue;

      const controls = root.querySelectorAll(
        "a, button, [role='button']",
      ).length;
      if (controls < 1) continue;
      roots.add(root);
    }

    // Drop nested duplicates — keep outermost rail container.
    const list = [...roots];
    return list.filter(
      (el) => !list.some((other) => other !== el && other.contains(el)),
    );
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
      const label = el.getAttribute("aria-label") || "";
      if (
        !ARIA_GEMINI.test(label) &&
        !/^google apps$|^main menu$|^settings$/i.test(label)
      ) {
        return;
      }
      if (el.closest("#rso, #center_col, [role='navigation']")) return;
      if (el.getBoundingClientRect().left > 100) return;
      consider(el);
    });

    document
      .querySelectorAll('img[alt*="Gemini" i], svg[aria-label*="Gemini" i]')
      .forEach((el) => {
        if (el.closest("#rso, #center_col")) return;
        consider(el);
      });

    findLeftRailsByGeometry().forEach((el) => roots.add(el));

    const list = [...roots];
    return list.filter(
      (el) => !list.some((other) => other !== el && other.contains(el)),
    );
  }

  globalThis.SEARCH_BEFORE_AI_collectGeminiRails = collectGeminiRails;
})();