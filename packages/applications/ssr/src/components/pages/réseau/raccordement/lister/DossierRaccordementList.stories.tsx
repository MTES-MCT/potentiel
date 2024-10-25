import type { Meta, StoryObj } from '@storybook/react';

import {
  DossierRaccordementListPage,
  DossierRaccordementListPageProps,
} from './DossierRaccordementList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Reseaux/Lister/DossierRaccordementListPage',
  component: DossierRaccordementListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<DossierRaccordementListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const itemsLength = 10;
export const Default: Story = {
  args: {
    filters: [
      {
        label: `Appel d'offres`,
        searchParamKey: 'appelOffre',
        options: [
          {
            label: 'Appel offre 1',
            value: 'appel-offre-1',
          },
          {
            label: 'Appel offre 2',
            value: 'appel-offre-2',
          },
        ],
      },
      {
        label: 'Mise en service',
        searchParamKey: 'dateMiseEnServiceTransmise',
        options: [
          {
            label: 'Date transmise',
            value: 'true',
          },
          {
            label: 'Date non transmise',
            value: 'false',
          },
        ],
      },
    ],
    list: {
      items: Array.from({ length: itemsLength }, (_, i) => ({
        appelOffre: `appelOffre${i}`,
        codePostal: `codePostal${i}`,
        commune: `commune${i}`,
        département: `département${i}`,
        région: `région${i}`,
        famille: `famille${i}`,
        identifiantProjet: {
          appelOffre: `appelOffre${i}`,
          famille: `famille${i}`,
          numéroCRE: `numéroCRE${i}`,
          période: `période${i}`,
        },
        nomProjet: `nomProjet${i}`,
        numéroCRE: `numéroCRE${i}`,
        période: `période${i}`,
        référenceDossier: {
          référence: `référence${i}`,
        },
        statutDGEC: i % 2 === 0 ? 'classé' : 'abandonné',
      })),
      range: {
        startPosition: 0,
        endPosition: 9,
      },
      total: itemsLength,
    },
  },
};
