import React from 'react';

import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';

import { StartDsfr } from '../src/app/StartDsfr';

import './static/dsfr/dsfr.min.css';
import './static/dsfr/utility/icons/icons.min.css';
import '../src/app/global.css';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({});
      return (
        <>
          <StartDsfr />

          <DsfrProvider>
            <MuiDsfrThemeProvider>
              <Story />
            </MuiDsfrThemeProvider>
          </DsfrProvider>
        </>
      );
    },
  ],
};

export default preview;
