// Every user-facing string and outbound link on the site lives here, so the
// pages stay pure structure. Edit this file to change the copy — no component
// needs touching.

export const site = {
  domain: 'tegaandhenry.com',
  url: 'https://tegaandhenry.com',

  /** Wordmark in the header and the browser title. */
  name: 'Tega & Henry',
  /** Two initials. Only rendered as a fallback, when `logo` is null. */
  monogram: 'T&H',

  /**
   * The emblem at the top of the hero, copied from the shared content pack at
   * `~/Development/tegaandhenry-content/assets/logo/` so this site and the
   * wedding site show the same mark while that one is being built.
   *
   * This is the **cream reversed** variant (`th-logo-cream.svg`,
   * `logoImageReversedPath` in the pack's `theme.json`), because it sits on the
   * darkened hero photograph. The default `th-logo.svg` is drawn for a cream
   * ground — deep green initials over a tan giraffe — and its initials all but
   * vanish against the scrim.
   *
   * Set to null to fall back to the old ring-and-initials monogram.
   */
  logo: {
    src: '/logo/th-logo-cream.svg',
    alt: 'Tega and Henry — a giraffe beside their initials',
    /** Rendered height. The artwork is portrait, roughly 5:7. */
    heightClass: 'h-32 sm:h-40',
  } as { src: string; alt: string; heightClass: string } | null,

  /** <meta name="description"> and the Open Graph description. */
  description:
    'The personal home of Tega and Henry — news, photographs, and whatever we are up to.',

  hero: {
    /** Small uppercase line above the names. Empty string hides it. */
    eyebrow: '',
    /** Italic line beneath the names. Empty string hides it. */
    strapline: '',
    /** Alt text for the hero photograph. */
    imageAlt:
      'Vineyard terraces and flower borders running out to a mountain range under a clear sky',
  },

  intro: {
    /** Small uppercase line above the body copy. Empty string hides it. */
    heading: '',
    /** One entry per paragraph. An empty array hides the section entirely. */
    body: [
      'A place for our news, our photographs, and of course our Wedding in 2028.',
      'Still being put together — do come back.',
    ],
    /**
     * Where this phrase appears in `body`, it renders as a link to
     * `weddingLink` rather than plain text. Set `weddingLink` to null and the
     * phrase quietly falls back to plain text, so the sentence still reads
     * correctly while the wedding site is not yet worth linking to.
     */
    linkPhrase: 'Wedding in 2028',
  },

  /** Rendered as small links in the footer. Delete any you do not want. */
  contact: [
    // { label: 'Email', href: 'mailto:hello@tegaandhenry.com' },
  ] as Array<{ label: string; href: string }>,

  /**
   * Link to the separately hosted wedding site. Currently null: this site is
   * itself standing in for the full wedding site, so there is nowhere worth
   * sending people yet.
   *
   * Setting it restores three things at once — the header nav item, the footer
   * entry, and the linked phrase in the intro copy (see `intro.linkPhrase`).
   * While it is null the phrase renders as ordinary text, so the sentence still
   * reads correctly and no dead link is left behind.
   *
   *   weddingLink: { label: 'Wedding', href: 'https://wedding.tegaandhenry.com' },
   */
  weddingLink: null as { label: string; href: string } | null,

  /** Unsplash does not require attribution, but the photographer deserves it. */
  photoCredit: {
    photographer: 'Matthias Wesselmann',
    href: 'https://unsplash.com/photos/gTL2Xhpnf3E',
  },
} as const;
