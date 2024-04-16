import type { Config } from 'tailwindcss';
import { fr } from '@codegouvfr/react-dsfr';

/**
 * @description Cette variable permet de récupérer les [différentes couleurs conforme DSFR](https://components.react-dsfr.codegouv.studio/?path=/docs/%F0%9F%8E%A8-color-helper--page).
 */
const decisionsColors = fr.colors.decisions;

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
      dsfr: {
        ...decisionsColors,
      },
      theme: {
        info: decisionsColors.text.default.info.default,
        warning: decisionsColors.text.default.warning.default,
        success: decisionsColors.text.default.success.default,
        error: decisionsColors.text.default.error.default,
        white: decisionsColors.text.inverted.grey.default,
        grey: decisionsColors.text.default.grey.default,
        black: decisionsColors.text.default.grey.default,
        blueFrance: decisionsColors.text.label.blueFrance.default,
      },
    },
  },
  plugins: [],
};

export default config;
