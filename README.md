# Dinesh Ravikumar: portfolio

A long-form, scroll-driven personal portfolio: astronaut and cloud imagery, an 8-column editorial grid, and eight chapters (journey, expertise, project missions, skills, experience, beyond, contact). Plain HTML, CSS and JavaScript, with **no framework and no dependencies**, hosted on **GitHub Pages**.

## Structure

```
site/                  ← everything that gets published
  index.html           ← all page content (edit text here)
  css/site.css         ← design system: tokens at the top, then one block per chapter
  js/site.js           ← behaviour: reveals, hero fragments, scroll camera, nav, constellations
  assets/img/          ← WebP images (1280 / 2560 / 3840 px variants)
  assets/cv/           ← public CV PDF (add Dinesh_Ravikumar_CV.pdf)
scripts/build.mjs      ← production build: validates every asset reference, copies site/ → dist/
.github/workflows/     ← GitHub Actions: build + deploy to Pages on push to main
docs/DESIGN_SYSTEM.md  ← type scale, grid, colours, spacing, motion rules
docs/ASSET_MANIFEST.md ← every image: source, photographer, size, licence
```

## Run locally

Any static server works. From the repo root:

```bash
python -m http.server 8000 --directory site     # then open http://localhost:8000
```

## Production build

```bash
node scripts/build.mjs        # needs Node 18+; output in dist/ (git-ignored)
```

The build fails if any image, stylesheet or script referenced by the HTML or CSS is missing. The CV PDF is optional and only produces a warning.

## Deploy (GitHub Pages)

1. Push this repository to `dineshrana8939-oss/My-Portfolio`.
2. On GitHub, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds, validates and publishes. The site appears at `https://dineshrana8939-oss.github.io/My-Portfolio/`. All paths are relative, so this sub-path works without configuration.
4. Before going public, remove `<meta name="robots" content="noindex">` from `site/index.html`, so search engines can index the site.

### Custom domain (later)
1. Add a file `site/CNAME` containing just the domain, for example `dineshravikumar.com`.
2. At your DNS provider, add an `A` record for the apex domain to GitHub Pages' published addresses (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or a `CNAME` record for `www` → `dineshrana8939-oss.github.io`.
3. In **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once the certificate is issued.

## Updating the site

| Change | Where |
|---|---|
| Text, roles, case studies, skills | `site/index.html`, in the chapter's `<section id="…">` block. Copy an existing `<article class="case">` to add a case study. |
| Colours, fonts, sizes, spacing | Tokens at the top of `site/css/site.css` (`:root`, `[data-env="sky"]`, `[data-env="space"]`) |
| Images | Add WebP files to `site/assets/img/` (1280 and 2560 px wide, never upscaled), update the `src`/`srcset`, and log the image in `docs/ASSET_MANIFEST.md` |
| Scroll camera / animations | `site/js/site.js` (`camera()` and `frame()`), plus the "Scroll camera" block in `site.css` |
| New page | Add `site/<name>.html` reusing `css/site.css` and `js/site.js`; link it from the nav |

## Git workflow

- `main` is production; every push deploys.
- Do work on a branch (`git switch -c update/<topic>`), run `node scripts/build.mjs`, then commit with a clear message and merge to `main` once approved.
- Never commit secrets: `.env` files are ignored.

## Static-hosting limits

GitHub Pages serves static files only. The current site needs no server: contact is a copy-email button plus links. A future contact *form* would need a hosted form endpoint (for example Formspree or Getform, free tiers), and any server logic would need a separate host.

## Credits

Photography from Unsplash (free licence): Bradley Dunn, Thomas Koukas, Mads Schmidt Rasmussen, Alex Shuper, Daniel Páscoa, Benjamin DeYoung, plus the ascent-sequence photos listed in `docs/ASSET_MANIFEST.md`. Fonts: Geist, Geist Mono and Instrument Serif (Google Fonts).
