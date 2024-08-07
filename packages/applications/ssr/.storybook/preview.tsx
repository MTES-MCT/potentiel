import React from 'react';

import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';

import { StartDsfr } from '../src/app/StartDsfr';
import { registerCandidatureQueries } from '@potentiel-domain/candidature';

import './static/dsfr/dsfr.min.css';
import './static/dsfr/utility/icons/icons.min.css';
import '../src/app/global.css';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

registerCandidatureQueries({
  récupérerCandidature: async () => {
    return {
      appelOffre: 'Appel offre',
      période: 'Période',
      famille: 'Famille',
      nom: 'Le projet',
      statut: 'classé',
      localité: {
        commune: 'Commune',
        codePostal: 'XXXXX',
        département: 'Département',
        région: 'Région',
        adresse: '',
      },
      dateDésignation: new Date('2021-10-22').toISOString() as Iso8601DateTime,
      adressePostaleCandidat: '',
      cahierDesCharges: '',
      email: '',
      nomCandidat: '',
      nomReprésentantLégal: '',
      numéroCRE: '',
      potentielIdentifier: '',
      puissance: 0,
      type: '',
    };
  },
  récupérerCandidaturesEligiblesPreuveRecanditure: async () => [],
  récupérerCandidatures: async () => ({
    items: [],
    total: 0,
  }),
});

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
