import type { Config } from 'tailwindcss';
import { fr } from '@codegouvfr/react-dsfr';

const {
  colors: { getHex, ...dsfrColors },
} = fr;

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
    },
    colors: {
      ...dsfrColors,
      white: fr.colors.decisions.text.inverted.grey.default,
      black: fr.colors.decisions.text.default.grey.default,
    },
  },
  plugins: [],
};

export default config;
