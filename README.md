# Kissward Multimedia Website

Official website for **Kissward Multimedia** — a creative and software agency in Accra, Ghana (est. 2015). Video editing, web/mobile/desktop development, graphic design, 2D & 3D animation, branding, and IT support.

## Live Site

- **Production:** https://www.kisswardmultimedia.top/

## Tech

- Pure static HTML/CSS/JS — no build step required
- Facebook Pixel + Google Analytics (gtag) for tracking
- SEO: Open Graph, JSON-LD, XML sitemap, robots.txt, custom 404 page

## Structure

```
.
├── index.html            # Homepage (single-page site)
├── privacy-policy.html   # Privacy policy
├── 404.html              # Custom 404 page
├── robots.txt            # Crawler rules
├── sitemap.xml           # XML sitemap
├── ads.txt               # Ads.txt policy
├── og-image.html         # Social share image renderer
├── .htaccess             # Apache rules (production host only)
├── assets/
│   ├── css/style.css     # Global styles
│   └── js/               # main.js, analytics.js
└── img/                  # Images & portfolio work
```

## Hosting

### GitHub Pages

This site can be served free via GitHub Pages:

1. Push this repository to GitHub.
2. Go to **Settings → Pages** for the repo.
3. Under **Build and deployment** → **Source**, select **Deploy from a branch** and pick `main` + `/ (root)`.
4. Save, then publish at `https://<username>.github.io/<repo>/`.

> The site uses relative paths (`img/`, `assets/`) so it works from any sub-path. The `.htaccess` file is Apache-specific and ignored by GitHub Pages — it can stay in the repo harmlessly.

### Production (kisswardmultimedia.top)

Upload the repo contents to the web root of your cPanel host. Keep `.htaccess` and the `robots.txt`/`sitemap.xml` which reference the production domain.

## Notes

- Trackers: Google Analytics ID and Meta Pixel are embedded in `index.html`. Remove or replace them for a non-tracked fork.
- There are duplicate portfolio images between `img/` and `assets/img/`; only `img/` is referenced by the HTML.
- Google Play app icons and the official Play badge live in `img/apps/` and are used by the "Apps" section near the top of the homepage.