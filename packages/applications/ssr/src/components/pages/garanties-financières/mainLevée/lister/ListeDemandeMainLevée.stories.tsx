import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import {
  ListeDemandeDeMainLevéeProps,
  ListeDemandeMainLevéePage,
} from './ListeDemandeMainLevée.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/MainLevée/Lister',
  component: ListeDemandeMainLevéePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<ListeDemandeDeMainLevéeProps>;

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
  {
    label: `Motif`,
    searchParamKey: 'motif',
    defaultValue: undefined,
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
          identifiantProjet: '#identifiantProjet-1',
          motif: 'projet-achevé',
          nomProjet: 'Projet 1',
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
          demandéLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
        },
        {
          identifiantProjet: '#identifiantProjet-2',
          motif: 'projet-abandonné',
          nomProjet: 'Projet 2',
          misÀJourLe: new Date('2024-02-12').toISOString() as Iso8601DateTime,
          demandéLe: new Date('2024-02-12').toISOString() as Iso8601DateTime,
        },
      ],
    },
  },
};
