# tegaandhenry.com

**Live at [tegaandhenry.com](https://tegaandhenry.com).** A single-page Astro
site, statically built and served from Cloudflare Pages.

> **Planned handover.** When the wedding application is ready it will take the
> apex domain — landing page, household RSVP links, guest sign-in and admin
> console on one origin, editable from its console without a deploy. There is no
> `wedding.` subdomain and none is planned. **That handover has not happened:
> this site serves the apex today, so do not detach the domain from this Pages
> project.** After the wedding the intention is to move it back here as the
> couple's long-term personal page. Steps in
> ["The planned handover"](GEMINI.md) in `GEMINI.md`.

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

- `weddingLink` — currently `null`. Setting it to `{ label, href }` restores three
  things at once: the header nav item, the footer entry, and the link on the phrase
  named by `intro.linkPhrase` (`Wedding in 2028`) in the body copy. While it is
  `null` that phrase renders as ordinary text, so the sentence still reads
  correctly and no dead link is left behind.
- `contact` — an empty array by default. Add `{ label, href }` entries to show
  contact or social links in the footer.
- `logo` — the hero emblem. Set to `null` to fall back to the ring-and-initials
  monogram that preceded it.

## The logo

The artwork comes from the shared content pack at
`~/Development/tegaandhenry-content/assets/logo/`, so this site and the wedding
site show the same mark. It is copied in rather than referenced — that repo is
not published, and this one must build standalone.

| Here | From the pack | Role |
| --- | --- | --- |
| `public/logo/th-logo-cream.svg` | `th-logo-cream.svg` | hero emblem |

`public/favicon.svg` is **not** from the pack. The pack's emblem
(`th-logo-simple.svg`) was tried and reverted: it is traced line art, thin
strokes over mostly empty space, and at a true 16px browser tab it renders as a
pale smudge rather than a mark. The favicon is the hand-drawn `T&H` monogram,
which was drawn for that size and weighs 525 bytes against the emblem's 16 kB
compressed. Swap it in only when there is a simplified mark with enough weight to
survive 16px.

The **cream reversed** variant is used on the hero deliberately. The default
`th-logo.svg` is drawn for a cream ground — deep green initials, tan giraffe —
and against the darkened photograph the initials all but disappear. The cream
variant is a single `#fbf9f2`, so it reads the way the old white monogram did.

The files are traced from a bitmap, so they are one or two paths of several
thousand segments — around 70 kB each after `svgo --multipass -p 1`, and 16–18 kB
over the wire once compressed. Re-run that if the pack ever ships new versions:

```
npx svgo --multipass -p 1 -i <source>.svg -o public/logo/<name>.svg
```

## Colours

The palette is the vineyard/safari scheme shared with the wedding engine, so the
two sites read as one brand. It is defined once, as CSS custom properties, at the
top of `src/layouts/BaseLayout.astro`:

| Token | Light | Role |
| --- | --- | --- |
| `--bg` | `#fbf9f2` | page ground |
| `--surface` | `#eef3ea` | soft wash panels |
| `--sage` | `#b9cfb2` | unused — see below |
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

`--sage` no longer renders anything. It coloured the thick bands that framed the
top and bottom of every page, which were removed; only the `--secondary` hairline
remains. The token is kept so the palette stays in step with the wedding engine's,
and so the bands can be restored by re-adding a `.band-sage` rule.

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
