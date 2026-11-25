# The Time Before AI

**The Time Before AI** is a free  Chrome extension that restores a classic Google Search experience: **blue links and web results first**, without AI summaries and AI Mode chrome in your face.

Use it when you want to remember what searching felt like before AI Overviews, the AI Mode tab, and the Gemini sidebar became part of every results page.

- **Search engine support (MVP):** Google Search (`google.com` and common regional domains)
- **Permissions:** `storage` only (saved toggles); runs only on Google `/search` pages
- **Privacy:** No analytics, no network calls — see [extension/PRIVACY.md](extension/PRIVACY.md)

## What it removes on Google

| Feature | What you get |
| -------- | ------------- |
| **AI Overview** | The generative answer block above organic results is hidden |
| **AI Mode tab** | The `udm=50` “AI Mode” vertical tab is hidden from the filter bar |
| **Gemini left rail** | The narrow left sidebar (gold **G**, chat history, settings) is hidden when Google shows it |

Organic results (`#rso`) stay visible. If Google’s layout shifts, we may need selector updates in a new release.

## Download

### Latest build (ZIP)

Download the packaged extension, extract it, then load the **folder** in Chrome (see [Install](#install)).

| Version | File |
| -------- | ---- |
| **0.1.4** | [**the-time-before-ai-v0.1.4.zip**](dist/the-time-before-ai-v0.1.4.zip) |

Direct link (main branch):

https://github.com/n0social/TheTimeBeforeAi/raw/main/dist/the-time-before-ai-v0.1.4.zip

> Chrome does not install from a `.zip` directly. Unzip first, then **Load unpacked** and select the extracted folder (it must contain `manifest.json` at the top level).

### Rebuild the ZIP yourself

```bash
./scripts/package-extension.sh
```

Output: `dist/the-time-before-ai-v<version>.zip` (version from `extension/manifest.json`).

## Install

### From the downloaded ZIP

1. Download [**the-time-before-ai-v0.1.4.zip**](dist/the-time-before-ai-v0.1.4.zip) and extract it to a folder on your computer.
2. Open Chrome → `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the **extracted** folder (not the `.zip` file).
5. Open [Google Search](https://www.google.com/search?q=what+is+photosynthesis) and confirm AI surfaces are hidden (when Google would normally show them for your account).

### From a git clone

```bash
git clone https://github.com/n0social/TheTimeBeforeAi.git
```

Then **Load unpacked** → select the `extension/` directory in the clone.

### After updates

On `chrome://extensions`, click **Reload** on **The Time Before AI**, then refresh open Google tabs.

## Settings

Click the extension icon in the toolbar:

- **Enabled on Google Search** — master switch  
- **Hide AI Overview**  
- **Hide AI Mode tab**  
- **Hide Gemini left sidebar**  

Changes sync via Chrome (`chrome.storage.sync`) when you’re signed in. Reload result tabs if something looks stale.

## How it works (brief)

1. **`hide.css`** injects at `document_start` to reduce flicker before AI blocks paint.  
2. **`content.js`** uses a debounced `MutationObserver` to find AI containers in the live DOM and hide them safely (without hiding the main result list).  
3. **`gemini-rail.js`** and **`labels.js`** hold heuristics for the Gemini rail and localized “AI Overview” headings.

Google changes markup often; if something slips through, open an issue with your locale and a screenshot.

## Roadmap

- [x] Google MVP — AI Overview, AI Mode tab, Gemini rail  
- [ ] More search engines (Bing, DuckDuckGo, etc.)  
- [ ] Optional “web-only” URL behavior and classic styling  

## Development

```text
extension/
  manifest.json
  content/          # SERP scripts + early CSS
  popup/            # Toolbar UI
  icons/
  PRIVACY.md
scripts/
  package-extension.sh
dist/               # Released .zip builds
store-assets/       # Chrome Web Store icon + listing copy
```

Validation checklist for manual QA:

- [ ] No AI Overview when Google would show one  
- [ ] AI Mode tab absent  
- [ ] Gemini rail absent (if you have the experiment)  
- [ ] Organic results still visible  
- [ ] Disabling the extension in the popup restores Google’s UI after reload  

## Chrome Web Store

Not published yet. Until then, use the [ZIP download](#download) or load from source.

## License

License TBD. Extension source is in this repository.

## Links

- Repository: https://github.com/n0social/TheTimeBeforeAi  
- Open a bug or request: [GitHub Issues](https://github.com/n0social/TheTimeBeforeAi/issues)
