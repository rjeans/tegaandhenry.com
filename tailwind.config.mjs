/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Mirrors the wedding engine's `serif-classic` token so the two
        // sites read as one brand. System stacks only — no webfont request.
        serif: ['Georgia', "'Times New Roman'", 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
