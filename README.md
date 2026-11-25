# The Time Before AI

Chrome extension that strips AI from Google Search—**AI Overviews**, the **AI Mode** tab, and the **Gemini left rail**—so you get classic web links. More search engines and retro styling are planned after we validate Google.

## Install (unpacked)

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and choose the [`extension/`](extension/) folder in this repo.
4. Run a query on [Google Search](https://www.google.com/search?q=test). Organic blue links should appear without the AI Overview block or AI Mode tab (when Google serves them for that query).

## Settings

Click the extension icon to toggle:

- **Enabled on Google Search** — master switch
- **Hide AI Overview** — removes the generative summary block
- **Hide AI Mode tab** — hides the `udm=50` AI Mode vertical tab
- **Hide Gemini left sidebar** — removes the left AI Mode / Gemini rail (gold G icon)

Reload open Google result tabs after changing settings.

## Project layout

```text
extension/
  manifest.json       # Manifest V3
  content/
    hide.css            # Early hide rules (reduces flicker)
    labels.js           # Localized AI Overview heading patterns
    gemini-rail.js      # Left Gemini / AI Mode sidebar
    content.js          # MutationObserver + safe container detection
  popup/                # Toolbar popup UI
  icons/
  PRIVACY.md
```

## Validation checklist

Use queries that often trigger AI Overviews (e.g. factual “what is …” questions). Confirm:

- [ ] No AI Overview panel above results (when Google would normally show one)
- [ ] AI Mode tab is absent from the result-type tabs
- [ ] Gemini left rail is hidden (if your account has the experiment)
- [ ] Organic results (`#rso`) still visible
- [ ] Toggling **Enabled** off in the popup restores Google’s default UI after reload

## Limitations (MVP)

- Google Search only; TLD list in `manifest.json` covers common locales (add more `matches` as needed).
- Google changes SERP markup often — update `content/labels.js` and selectors in `content/content.js` when layouts shift.
- Does not yet rewrite URLs to “web-only” mode or add nostalgic styling.

## Privacy

See [extension/PRIVACY.md](extension/PRIVACY.md).

## Repo

https://github.com/n0social/TheTimeBeforeAi