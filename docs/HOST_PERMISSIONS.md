# Host permission explanation — The Time Before AI

Use this text in the **Chrome Web Store** “Permission justification” and “Single purpose” sections.

## Brief explanation (for reviewers and users)

**The Time Before AI** only needs to run on **Google Search result pages**. It injects CSS and JavaScript on those pages to hide AI Overviews, the AI Mode tab, and the Gemini left rail. It does not request access to all websites, does not read your searches on our servers, and does not add network requests.

## What the manifest actually declares

| Declaration | Purpose |
| ----------- | ------- |
| `"permissions": ["storage"]` | Save your on/off toggles in the browser (`chrome.storage.sync`). |
| `content_scripts.matches` | Limit where CSS/JS run: `*/search*` URLs on listed `google.*` domains only. |

There is **no** `host_permissions` entry for `<all_urls>` or unrelated sites.

## Why Chrome still shows “site access” or host access

In Manifest V3, **content scripts** that match specific URL patterns still count as **access to those hosts** — Chrome must inject files on Google Search to hide AI UI. That is intentional and scoped to search results, not Gmail, YouTube, or arbitrary pages.

## What we do not do with that access

- No extraction of queries, clicks, or account data to external servers  
- No iframe embedding of third-party trackers  
- No modification of requests/responses to Google’s APIs  
- No execution on non-Google sites (MVP)

## Store dashboard copy-paste

**Host permission / site access justification:**

```text
The extension runs content scripts only on Google Search result pages (google.* URLs whose path includes /search) so it can hide AI Overviews, the AI Mode tab, and the Gemini sidebar in the page DOM. It does not use <all_urls>, does not access non-search Google pages, and does not transmit page content to any external server.
```

**Storage permission:**

```text
Stores the user’s extension toggle settings locally via chrome.storage.sync. No data is sent to the developer’s servers.
```