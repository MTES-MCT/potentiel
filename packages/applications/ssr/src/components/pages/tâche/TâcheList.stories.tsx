import type { Meta, StoryObj } from '@storybook/react';

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

const commonItem: TâcheListPageProps['list']['items'][number] = {
  nomProjet: 'Nom projet 1',
  identifiantProjet: {
    appelOffre: 'Appel offre 1',
    période: 'Période 1',
    famille: 'Famille 1',
    numéroCRE: 'Numéro CRE 1',
  },
  misÀJourLe: {
    date: new Date().toISOString(),
  },
  typeTâche: {
    type: 'inconnue',
  },
};

export const Default: Story = {
  args: {
    filters: [
      {
        label: `Appel d'offres`,
        searchParamKey: 'appelOffre',
        options: [
          { label: 'Appel offre 1', value: 'appel-offre-1' },
          { label: 'Appel offre 2', value: 'appel-offre-2' },
        ],
      },
    ],
    list: {
      items: [
        {
          ...commonItem,
          typeTâche: {
            type: 'abandon.transmettre-preuve-recandidature',
          },
        },
        {
          ...commonItem,
          typeTâche: {
            type: 'abandon.confirmer',
          },
        },
        {
          ...commonItem,
          typeTâche: {
            type: 'raccordement.référence-non-transmise',
          },
        },
      ],
      range: {
        startPosition: 0,
        endPosition: 9,
      },
      total: 3,
    },
  },
};
