# tegaandhenry.com

The permanent home page for Tega and Henry. A single-page Astro site, statically
built and served from Cloudflare Pages.

It is deliberately separate from the wedding site: this one is public, permanent,
and outlives the wedding. The wedding site is a different application, hosted at
`wedding.tegaandhenry.com` behind authentication.

Outstanding work is tracked in [`TODO.md`](TODO.md). Context for AI coding
sessions is in [`GEMINI.md`](GEMINI.md).

## Stack

| | |
| --- | --- |
| Framework | Astro 5, `output: 'static'` — no adapter, no server runtime |
| Styling | Tailwind 3 + CSS custom properties for the palette |
| Images | `astro:assets` (`<Picture>`) — AVIF/WebP/JPEG at five widths, built at deploy time |
| Hosting | Cloudflare Pages (see `HOSTING.md`) |

Structurally this mirrors [jeansy.org](https://jeansy.org): a single `BaseLayout`,
system-font typography, and a light/dark toggle that remembers the visitor's choice.

## Commands

```
npm install
npm run dev       # local dev server, http://localhost:4321
npm run build     # static build into dist/
npm run preview   # serve dist/ locally
npx astro check   # typecheck
```

## Editing the site

**All copy lives in `src/config/site.ts`.** The pages contain structure only, so
changing the wording, the strapline, the monogram, or the footer links means
editing that one file — no component needs touching.

Notable switches in there:

- `weddingLink` — the quiet footer pointer to `wedding.tegaandhenry.com`, for
  guests who mislay their invitation email. Set it to `null` to remove it entirely.
- `contact` — an empty array by default. Add `{ label, href }` entries to show
  contact or social links in the footer.

## Colours

The palette is the vineyard/safari scheme shared with the wedding engine, so the
two sites read as one brand. It is defined once, as CSS custom properties, at the
top of `src/layouts/BaseLayout.astro`:

| Token | Light | Role |
| --- | --- | --- |
| `--bg` | `#fbf9f2` | page ground |
| `--surface` | `#eef3ea` | soft wash panels |
| `--sage` | `#b9cfb2` | framing bands |
| `--primary` | `#4a9b45` | emphasis |
| `--secondary` | `#a8a259` | hairline rules |
| `--accent` | `#f2c3c2` | ornament, monogram ring |
| `--text` | `#30322f` | body copy |
| `--muted` | `#656a5d` | supporting copy |

`--muted` is deliberately a shade darker than the wedding engine's `#7d8273`, which
only reaches 3.75:1 against the cream background — below AA for body text. The
original brand value is kept as `--muted-soft` for large and decorative text. The
link green is likewise darkened to `#2f6b2c` (6.0:1); `--primary` itself is only
3.3:1 and so is used for accents, never for small text.

Dark-mode counterparts for every token are in the same block.

## Images

`images/` holds the full-resolution originals (8000px, ~18 MB each) and is
**gitignored** — a local archive only. Git stores binaries whole, so committing
them would add ~18 MB to every clone for each revision, permanently, to no benefit:
nothing in the build reads that directory.

What the build uses is the web-sized master committed at
`src/assets/hero-winelands.jpg` (2560px, 1.6 MB), from which Astro generates
responsive AVIF/WebP/JPEG variants. The smallest AVIF the build emits is 39 kB.

Because the originals are not in the repo, **keep them backed up somewhere else** —
a clean clone cannot regenerate the master from scratch. The hero is a free
Unsplash download (link below), so this one is replaceable; future personal
photographs will not be.

To swap the hero, replace `src/assets/hero-winelands.jpg` and update
`site.hero.imageAlt` and `site.photoCredit`.

`public/images/og-home.jpg` is the 1200×630 Open Graph card, cropped from the same
photograph. Regenerate it after a hero change:

```
sips -Z 1200 -s format jpeg -s formatOptions 80 images/<original>.jpeg --out public/images/og-home.jpg
sips -c 630 1200 public/images/og-home.jpg
```

## Credit

Hero photograph by [Matthias Wesselmann](https://unsplash.com/photos/gTL2Xhpnf3E)
on Unsplash. Attribution is not required by the Unsplash licence, but is given in
the footer regardless.
