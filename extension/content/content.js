(() => {
  const ROOT_CLASS = "search-before-ai";
  const HIDDEN_ATTR = "data-search-before-ai-hidden";
  const AI_MODE_UDM = "50";
  const RESULTS_SELECTOR = "#center_col, #search, #rso";

  const DEFAULTS = {
    enabled: true,
    hideAiOverview: true,
    hideAiModeTab: true,
  };

  /** @type {typeof DEFAULTS} */
  let settings = { ...DEFAULTS };

  const labelPatterns = globalThis.SEARCH_BEFORE_AI_LABELS ?? [/^ai overview$/i];
  const aiModeTabPattern = globalThis.SEARCH_BEFORE_AI_MODE_TAB ?? /^ai mode$/i;

  const hidesOrganicResults = (el) =>
    el?.matches?.(RESULTS_SELECTOR) ||
    Boolean(el?.querySelector?.(RESULTS_SELECTOR));

  function getMainBody() {
    return document.querySelector("#rcnt") || document.querySelector("#center_col");
  }

  function climbToAiBlock(startEl) {
    let el = startEl;
    while (el?.parentElement) {
      const parent = el.parentElement;
      if (parent.id === "rso" || parent.id === "rcnt") return el;

      const siblingHasResults = [...parent.children].some(
        (child) =>
          child !== el &&
          (child.matches(RESULTS_SELECTOR) ||
            child.querySelector(`${RESULTS_SELECTOR}, a[href] h3`)),
      );
      if (siblingHasResults) return el;
      el = parent;
    }
    return startEl;
  }

  function storeHiddenDisplay(el) {
    if (!el.hasAttribute(HIDDEN_ATTR)) {
      el.setAttribute(HIDDEN_ATTR, el.style.display || "");
    }
    el.style.display = "none";
  }

  function restoreIfContainsResults() {
    document.querySelectorAll(`[${HIDDEN_ATTR}]`).forEach((el) => {
      if (hidesOrganicResults(el) || el.querySelector("a[href] h3")) {
        el.style.display = el.getAttribute(HIDDEN_ATTR) ?? "";
        el.removeAttribute(HIDDEN_ATTR);
      }
    });
  }

  function findAiOverviewBlock(mainBody) {
    if (!mainBody) return null;

    const folsrch =
      mainBody.querySelector('[data-async-type="folsrch"]') ||
      mainBody.querySelector('[id^="folsrch"]');
    if (folsrch) {
      const block = climbToAiBlock(folsrch);
      if (block && !hidesOrganicResults(block)) return block;
    }

    for (const heading of mainBody.querySelectorAll('[role="heading"], h1, h2, h3')) {
      const text = heading.textContent?.trim() ?? "";
      if (!labelPatterns.some((re) => re.test(text))) continue;
      const block = climbToAiBlock(heading);
      if (block.parentElement?.id === "rcnt" && !hidesOrganicResults(block)) {
        return block;
      }
    }
    return null;
  }

  function findExtraAiTitleBlocks(mainBody) {
    if (!mainBody) return [];
    return [...mainBody.querySelectorAll('[role="heading"]')]
      .filter((h) => labelPatterns.some((re) => re.test(h.textContent?.trim() ?? "")))
      .map(climbToAiBlock)
      .filter((block) => block.parentElement?.id === "rcnt" && !hidesOrganicResults(block));
  }

  function isAiModeHref(href) {
    try {
      return new URL(href, location.origin).searchParams.get("udm") === AI_MODE_UDM;
    } catch {
      return href.includes(`udm=${AI_MODE_UDM}`);
    }
  }

  function findAiModeTabs() {
    const tabs = new Set();
    for (const link of document.querySelectorAll('a[href*="udm="]')) {
      if (isAiModeHref(link.href)) {
        tabs.add(link.closest('[role="listitem"]') || link);
      }
    }
    const tabList = document.querySelector('[role="list"]');
    if (tabList) {
      for (const tab of tabList.children) {
        if (aiModeTabPattern.test(tab.textContent?.trim() ?? "")) tabs.add(tab);
      }
    }
    return [...tabs];
  }

  function applyRootClass() {
    document.documentElement.classList.toggle(ROOT_CLASS, settings.enabled);
  }

  function runCleanup() {
    if (!settings.enabled) return;

    restoreIfContainsResults();

    if (settings.hideAiOverview) {
      const main = getMainBody();
      const overview = findAiOverviewBlock(main);
      if (overview) storeHiddenDisplay(overview);
      findExtraAiTitleBlocks(main).forEach(storeHiddenDisplay);
    }

    if (settings.hideAiModeTab) {
      findAiModeTabs().forEach(storeHiddenDisplay);
    }
  }

  let scheduled = false;
  function scheduleCleanup() {
    if (scheduled) return;
    scheduled = true;
    const run = () => {
      scheduled = false;
      runCleanup();
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 200 });
    } else {
      requestAnimationFrame(run);
    }
  }

  function startObserver() {
    const observer = new MutationObserver(scheduleCleanup);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    scheduleCleanup();
  }

  function loadSettings() {
    if (!chrome.storage?.sync) {
      applyRootClass();
      startObserver();
      return;
    }
    chrome.storage.sync.get(DEFAULTS, (stored) => {
      settings = { ...DEFAULTS, ...stored };
      applyRootClass();
      startObserver();
    });
  }

  applyRootClass();

  if (document.documentElement) {
    loadSettings();
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      loadSettings,
      { once: true },
    );
  }

  chrome.storage?.onChanged?.addListener((changes, area) => {
    if (area !== "sync") return;
    Object.keys(DEFAULTS).forEach((key) => {
      if (changes[key]) settings[key] = changes[key].newValue;
    });
    applyRootClass();
    if (!settings.enabled) {
      document.querySelectorAll(`[${HIDDEN_ATTR}]`).forEach((el) => {
        el.style.display = el.getAttribute(HIDDEN_ATTR) ?? "";
        el.removeAttribute(HIDDEN_ATTR);
      });
    } else {
      scheduleCleanup();
    }
  });
})();