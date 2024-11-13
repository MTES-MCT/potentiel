import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  ListeDemandeMainlevéePage,
  ListeDemandeMainlevéeProps,
} from './ListeDemandeMainlevée.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Mainlevée/Lister',
  component: ListeDemandeMainlevéePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<ListeDemandeMainlevéeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const filters = [
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
    label: `Motif`,
    searchParamKey: 'motif',
    options: [
      {
        label: 'Projet abandonnée',
        value: 'projet-abandonnée',
      },
      {
        label: 'Projet achevé',
        value: 'projet-achevé',
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
          identifiantProjet: 'AO#1#1#identifiantProjet-1',
          motif: 'projet-achevé',
          nomProjet: 'Projet 1',
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
          demandéLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
          peutInstruireMainlevée: true,
          statut: 'en-instruction',
        },
        {
          identifiantProjet: 'AO#1#1#identifiantProjet-2',
          motif: 'projet-abandonné',
          nomProjet: 'Projet 2',
          misÀJourLe: new Date('2024-02-12').toISOString() as Iso8601DateTime,
          demandéLe: new Date('2024-02-12').toISOString() as Iso8601DateTime,
          peutInstruireMainlevée: false,
          statut: 'demandé',
        },
      ],
    },
  },
};
