// Every user-facing string and outbound link on the site lives here, so the
// pages stay pure structure. Edit this file to change the copy — no component
// needs touching.

export const site = {
  domain: 'tegaandhenry.com',
  url: 'https://tegaandhenry.com',

  /** Wordmark in the header and the browser title. */
  name: 'Tega & Henry',
  /** Two initials, shown inside the monogram ring. */
  monogram: 'T&H',

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
   * The separately hosted wedding site. Its landing page is public, so this is
   * an ordinary link — both the footer entry and `intro.linkPhrase` in the body
   * copy point at it. Set to null to remove both at once.
   */
  weddingLink: {
    label: 'Wedding',
    href: 'https://wedding.tegaandhenry.com',
  } as { label: string; href: string } | null,

  /** Unsplash does not require attribution, but the photographer deserves it. */
  photoCredit: {
    photographer: 'Matthias Wesselmann',
    href: 'https://unsplash.com/photos/gTL2Xhpnf3E',
  },
} as const;
