# Visitor Tracking Setup

This site uses iCount for simple visitor tracking.

Why this option:

- free
- no signup required
- no credit card required
- no separate backend needed
- works on static HTML pages
- supports total visits and realtime online count

## What users see

```text
3 online | 128 visits
```

## Important local testing note

When you open the site directly from your computer with a `file://` path, some browsers, ad blockers, DNS settings, or
networks may block the external counter request. In that case the widget may show:

```text
0 online | 0 visits
```

That does not necessarily mean the code is missing. The real test is after hosting the site on a public URL.

## Hosting

After you host the site on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any normal public URL, the tracker uses
the real domain and should start incrementing.

The tracker id is generated from the domain and page path. Example:

```text
yourdomain.com_rate-limiter-page
yourdomain.com_splitwise-page
yourdomain.com_home
```

## Files

Every page loads:

```html
<link rel="stylesheet" href="visitor-tracker.css">
<script src="visitor-tracker.js"></script>
```

Subfolder pages use `../visitor-tracker.css` and `../visitor-tracker.js`.

## Source

iCount documentation:

```text
https://icount.kr/docs/
```

iCount API:

```text
https://icount.kr/api.php?id=your-site-id
```
