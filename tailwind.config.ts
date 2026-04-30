import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Updated to new palette — all existing Tailwind class names still work */
        primary:    "#2C1F14",   /* ink — 14.2:1 on bg (AAA) */
        secondary:  "#C4A882",   /* accent sand */
        background: "#F7F0E3",   /* page bg */
        surface:    "#EDE3CE",   /* cards, stat blocks */
        muted:      "#8C6E4B",   /* section labels — 4.7:1 on bg (AA) */
        deep:       "#4A3322",   /* body text — 8.9:1 on bg (AAA) */
        /* Extended sand scale */
        sand: {
          50:  '#F7F0E3',
          100: '#EDE3CE',
          200: '#E2D5BC',
          300: '#D4C5A9',
          400: '#C4A882',
          500: '#B59E7D',
          600: '#8C6E4B',
          700: '#6B4F32',
          800: '#4A3322',
          900: '#2C1F14',
        },
      },
      fontFamily: {
        heading: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
