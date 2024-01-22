import React from 'react';

import type { Preview } from '@storybook/react';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';

import { StartDsfr } from '../src/app/StartDsfr';

import '../src/app/global.css';
import '../.next/static/css/59864da3adfd3489.css';
import '../.next/static/css/69615fe075a559cb.css';

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
