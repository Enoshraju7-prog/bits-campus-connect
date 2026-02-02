import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          pilani: '#DC2626',
          goa: '#059669',
          hyderabad: '#7C3AED',
          dubai: '#D97706',
        },
      },
    },
  },
  plugins: [],
};

export default config;
