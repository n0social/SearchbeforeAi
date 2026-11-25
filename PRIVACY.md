# Privacy Policy — The Time Before AI

**Effective date:** November 25, 2026  
**Extension:** The Time Before AI (Chrome extension, Manifest V3)  
**Repository:** https://github.com/n0social/TheTimeBeforeAi

This policy describes how **The Time Before AI** (“the extension,” “we,” “our”) handles information when you use the extension. We built it so we **do not need your personal data** to make it work.

## Summary

- **We do not collect, sell, rent, or trade your personal data.**
- **We do not run analytics, ads, or tracking.**
- **We do not send your data to our servers** (we operate no backend for this extension).
- The extension **only runs on Google Search result pages** listed in `extension/manifest.json`.
- Your **settings toggles** may be stored locally in the browser via Chrome’s storage APIs.

## Who this applies to

Anyone who installs or uses The Time Before AI from source, a release package, or the Chrome Web Store (when published).

## Information the extension processes

### Data we do not collect

The extension does **not** intentionally collect:

- Name, email, or Google account identifiers  
- Search queries or keywords  
- Browsing history outside the matched Google Search URLs  
- Location, device identifiers for tracking, or advertising IDs  

We do **not** use cookies or similar technologies for tracking. We do **not** embed third-party analytics SDKs.

### Data stored on your device

The extension uses Chrome’s **`storage`** permission with `chrome.storage.sync` (when available) to remember your preferences, for example:

- Whether the extension is enabled  
- Whether to hide AI Overview, AI Mode tab, or Gemini sidebar  

Those values are handled by **Google Chrome** as part of your browser profile (and may sync across your devices if you use Chrome sync). **We never receive a copy** of these settings.

### What happens on Google Search pages

On URLs where the extension is active, it:

- Injects **CSS** and **JavaScript** to hide or collapse specific AI-related parts of the page (DOM only).  
- Does **not** read or transmit the content of your searches to us.  
- Does **not** modify network requests to Google.

All of this runs **entirely in your browser**.

## Site access (host / content script scope)

The extension does **not** request broad host permissions such as `<all_urls>`.

It declares **content scripts** only for **Google Search** URLs (paths containing `/search` on certain Google country domains). That is the minimum access needed to hide AI UI on those pages. See [Host permission explanation](#host-permission-explanation) below and [docs/HOST_PERMISSIONS.md](docs/HOST_PERMISSIONS.md).

## Third parties

- **Google** — You use Google Search subject to Google’s own policies; we are not affiliated with Google.  
- **GitHub** — If you download the extension from our repository, GitHub’s policies apply to that website.  
- **Google Chrome Web Store** — If you install from the Store, Google’s distribution and update policies apply.

We do not share data with data brokers or advertisers.

## Children

The extension is not directed at children under 13, and we do not knowingly collect personal information from children.

## Security

The extension contains no remote code. Updates come only through Chrome’s normal extension update mechanism (or manual loads from our published package).

## Changes to this policy

We may update this policy when the extension changes (new features, permissions, or stores). We will post the current version in this repository and update the **Effective date** above.

## Contact

Questions or privacy requests:

- **Issues:** https://github.com/n0social/TheTimeBeforeAi/issues  
- **Repository:** https://github.com/n0social/TheTimeBeforeAi  

---

## Host permission explanation

**Short answer for the Chrome Web Store:** The extension needs access to **Google Search result pages only** so it can inject CSS/JS that hides AI Overviews, the AI Mode tab, and the Gemini sidebar. It does **not** need access to all websites.

| Question | Answer |
| -------- | ------ |
| Does it use `host_permissions` for `<all_urls>`? | **No** |
| What sites can it run on? | Only URL patterns in `manifest.json` → `content_scripts.matches` (Google domains, `/search` paths) |
| Why? | To change the appearance of those pages locally (hide AI UI) |
| Does it read my searches off-device? | **No** |
| Permissions declared | `storage` only, plus automatic content-script access for matched Google Search URLs |

More detail: [docs/HOST_PERMISSIONS.md](docs/HOST_PERMISSIONS.md).