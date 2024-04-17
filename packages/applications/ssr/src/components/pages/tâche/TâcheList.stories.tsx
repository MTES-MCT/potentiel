import type { Meta, StoryObj } from '@storybook/react';

import { DisplayDateFormatted } from '@/utils/displayDate';

import { TâcheListPage, TâcheListPageProps } from './TâcheList.page';

const meta = {
  title: 'Pages/Tâches',
  component: TâcheListPage,
  parameters: {
    docs: {
      description: {
        component: 'Cette page liste les tâches disponible dans le centre des tâches de Potentiel',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<TâcheListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonItem = {
  appelOffre: 'Appel offre 1',
  période: 'Période 1',
  identifiantProjet: 'identifiant-projet-1',
  nomProjet: 'Nom projet 1',
  misÀJourLe: '01/01/2024' as DisplayDateFormatted,
};

export const Default: Story = {
  args: {
    filters: [
      {
        label: `Appel d'offres`,
        searchParamKey: 'appelOffre',
        defaultValue: undefined,
        options: [
          { label: 'Appel offre 1', value: 'appel-offre-1' },
          { label: 'Appel offre 2', value: 'appel-offre-2' },
        ],
      },
    ],
    list: {
      currentPage: 1,
      items: [
        {
          ...commonItem,
          typeTâche: 'abandon.transmettre-preuve-recandidature',
        },
        {
          ...commonItem,
          typeTâche: 'abandon.confirmer',
        },
        {
          ...commonItem,
          typeTâche: 'raccordement.référence-non-transmise',
        },
      ],
      itemsPerPage: 10,
      totalItems: 10,
    },
  },
};
