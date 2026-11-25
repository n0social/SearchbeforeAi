# Chrome Web Store — listing kit

Use this document when filling out the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). Update version numbers and screenshot links before each publish.

## Assets in this repo

| Asset | Path | Store use |
| ----- | ---- | --------- |
| **Store icon (128×128)** | [`icons/chrome-store-icon-128.png`](icons/chrome-store-icon-128.png) | **Required** — “Store icon” upload |
| **High-res master** | [`icons/icon-master-512.png`](icons/icon-master-512.png) | Marketing, future tiles |
| **Package ZIP** | [`../dist/the-time-before-ai-v*.zip`](../dist/) | Upload under **Package** (or zip `extension/` after bumping version) |

Extension toolbar icons (`16`, `48`, `128`) live in [`extension/icons/`](../extension/icons/) and ship inside the ZIP.

### Icon concept

**Caveman + magnifying glass** — “search from the time before AI.” We intentionally do **not** use Google’s logo or colors (trademark).

Pixel art is generated from the master illustration: **40×40** logical pixels, fixed retro palette, dark outlines, nearest-neighbor upscale. Regenerate:

```bash
python3 store-assets/scripts/to-pixel-art.py --grid 40
```

---

## Dashboard fields (copy/paste)

### Primary language

English (United States)

### Item name (max 45 characters)

```text
The Time Before AI
```

### Summary / short description (max 132 characters)

```text
Hide Google AI Overviews, AI Mode, and Gemini. Classic web search results—links first, not AI answers.
```

(Character count: 99 — room to tweak.)

### Description (detailed)

```text
The Time Before AI brings back a classic Google Search experience.

Tired of AI Overviews, the AI Mode tab, and the Gemini sidebar on every query? This extension hides those surfaces so you can get to real web results—the blue links—faster.

WHAT IT DOES
• Hides AI Overviews on Google Search result pages
• Hides the AI Mode tab (udm=50)
• Hides the Gemini / AI Mode left sidebar when Google shows it
• Keeps organic search results visible

WHAT IT DOES NOT DO
• It is not made by Google and is not affiliated with Google
• It does not change your Google account or Search settings server-side
• It does not block AI on non-Google sites (MVP is Google only)

HOW TO USE
1. Install the extension
2. Search on Google as usual
3. Use the toolbar popup to turn features on or off
4. Reload Google tabs after changing settings

PRIVACY
• Only permission: storage (your on/off toggles)
• Runs only on Google Search URLs matched in the extension
• No analytics, no servers, no data collection

Open source: https://github.com/n0social/TheTimeBeforeAi
```

### Category

**Productivity** (alternate: **Search Tools** if available in your dashboard)

### Single purpose description

```text
This extension has a single purpose: to hide AI-powered UI elements on Google Search result pages so users see classic web link results.
```

### Permission justifications

**`storage`**

```text
Stores the user’s toggle preferences (enabled, hide AI Overview, hide AI Mode tab, hide Gemini sidebar) so choices persist across browser sessions. No data is sent off the device.
```

**Host / site access** (content scripts on Google Search only)

```text
The extension reads and modifies the DOM only on Google Search result pages to hide AI Overviews, the AI Mode tab, and the Gemini sidebar. It does not run on other sites.
```

### Privacy practices (certification)

- **No**, this extension does not sell or transfer user data to third parties  
- **No** collection of personally identifiable information  
- **No** use of data for unrelated purposes  

**Privacy policy URL** (host the policy at a stable public URL):

```text
https://github.com/n0social/TheTimeBeforeAi/blob/main/extension/PRIVACY.md
```

If the dashboard requires a dedicated page, add `docs/privacy.html` on GitHub Pages or link the raw README privacy section.

### Support / contact

- **Support URL:** `https://github.com/n0social/TheTimeBeforeAi/issues`  
- **Homepage URL (optional):** `https://github.com/n0social/TheTimeBeforeAi`  

---

## Screenshots (you must provide)

Chrome needs **at least one** screenshot. Recommended size: **1280×800** (or 640×400 minimum).

Suggested captures (sign in to Google so AI UI appears, then install extension):

1. **Before/after** — same query; optional side-by-side in one image  
2. **Clean SERP** — results with no AI Overview, tabs without AI Mode  
3. **Popup** — settings toggles  
4. **Gemini rail** — before/after if you have the left-sidebar experiment  

Save exports under `store-assets/screenshots/` when ready (not included in v0.1.4).

### Optional promo images

| Type | Size |
| ---- | ---- |
| Small promo tile | 440×280 |
| Marquee promo tile | 1400×560 |

Use `icon-master-512.png` plus short tagline: **“Search before AI.”**

---

## Submission checklist

- [ ] Zip built from `extension/` (`./scripts/package-extension.sh`)  
- [ ] `manifest.json` version matches release notes  
- [ ] Store icon **128×128** uploaded  
- [ ] At least **1 screenshot** uploaded  
- [ ] Privacy policy URL live  
- [ ] Single purpose + permission justifications pasted  
- [ ] Tested on fresh profile: Load unpacked or ZIP extract  
- [ ] Listing states **not affiliated with Google**  

---

## Version history (suggested)

### 0.1.4

- New caveman store / extension icons  
- Google MVP: AI Overview, AI Mode tab, Gemini rail  

### 0.1.3

- Initial public MVP  