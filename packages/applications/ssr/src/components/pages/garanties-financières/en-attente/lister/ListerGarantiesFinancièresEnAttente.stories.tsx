import type { Meta, StoryObj } from '@storybook/react';

import {
  ListerGarantiesFinancièresEnAttentePage,
  ListerGarantiesFinancièresEnAttenteProps,
} from './ListerGarantiesFinancièresEnAttente.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/En attente/Lister',
  component: ListerGarantiesFinancièresEnAttentePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<ListerGarantiesFinancièresEnAttenteProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const filters = [
  {
    label: `Appel d'offres`,
    searchParamKey: 'appelOffre',
    defaultValue: undefined,
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
];

const list = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 10,
};

export const Default: Story = {
  args: {
    filters,
    list: {
      ...list,
      items: [
        {
          identifiantProjet: '#identifiantProjet-1',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'en-attente',
          misÀJourLe: '2023-02-12',
          régionProjet: 'Région A / Région B',
          action: 'relancer',
        },
        {
          identifiantProjet: '#identifiantProjet-3',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'en-attente',
          misÀJourLe: '2023-02-12',
          dateÉchéance: '2023-02-12',
          régionProjet: 'Région A / Région B',
          action: 'télécharger--modèle-mise-en-demeure',
        },
      ],
    },
  },
};
