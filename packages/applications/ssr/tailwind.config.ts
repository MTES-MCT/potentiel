import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'grey-425': {
          base: '#666666',
          hover: '#919191',
          active: '#a6a6a6',
        },
        'grey-625': {
          base: '#929292',
          hover: '#bbbbbb',
          active: '#cecece',
        },
        'success-425': {
          base: '#18753c',
          hover: '#27a959',
          active: '#2fc368',
        },
        'warning-425': {
          base: '#b34000',
          hover: '#ff6218',
          active: '#ff7a55',
        },
        'blue-france-sun': {
          base: '#000091',
          hover: '#1212ff',
          active: '#2323ff',
        },
      },
    },
  },
  plugins: [],
};
export default config;
