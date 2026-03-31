import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marquis: {
          primary: '#6C3CE1',
          secondary: '#1E1E2E',
          accent: '#F5A623',
        },
      },
    },
  },
  plugins: [],
};

export default config;
