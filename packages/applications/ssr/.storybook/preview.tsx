import React from 'react';

import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { createMuiDsfrThemeProvider } from '@codegouvfr/react-dsfr/mui';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { StartDsfr } from '../src/app/StartDsfr';

import './static/dsfr/dsfr.min.css';
import './static/dsfr/utility/icons/icons.min.css';
import '../src/app/global.css';

Candidature.registerCandidatureQueries({
  récupérerProjet: async () => {
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
      technologie: '',
      engagementFournitureDePuissanceAlaPointe: false,
      evaluationCarbone: 0,
      isFinancementParticipatif: false,
      isInvestissementParticipatif: false,
      motifsElimination: '',
      prixReference: 0,
      actionnariat: '',
    };
  },
  récupérerProjetsEligiblesPreuveRecanditure: async () => [],
  récupérerProjets: async () => ({
    items: [],
    total: 0,
  }),
  find: async () => Option.none,
  list: async () => {
    return {
      items: [],
      total: 0,
      range: {
        endPosition: 0,
        startPosition: 0,
      },
    };
  },
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
