const DEFAULTS = {
  enabled: true,
  hideAiOverview: true,
  hideAiModeTab: true,
  hideGeminiRail: true,
};

const form = document.getElementById("settings");

function readForm() {
  const data = new FormData(form);
  return {
    enabled: data.get("enabled") === "on",
    hideAiOverview: data.get("hideAiOverview") === "on",
    hideAiModeTab: data.get("hideAiModeTab") === "on",
  };
}

function fillForm(values) {
  for (const [key, checked] of Object.entries(values)) {
    const input = form.elements.namedItem(key);
    if (input && "checked" in input) input.checked = checked;
  }
}

chrome.storage.sync.get(DEFAULTS, (stored) => {
  fillForm({ ...DEFAULTS, ...stored });
});

form.addEventListener("change", () => {
  chrome.storage.sync.set(readForm());
});