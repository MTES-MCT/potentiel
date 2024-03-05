import type { Meta, StoryObj } from '@storybook/react';

import {
  GarantiesFinancièresListPage,
  GarantiesFinancieresListPageProps,
} from './GarantiesFinancièresList.page';
import { GarantiesFinancièresListItemProps } from './GarantiesFinancièresListItem';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Lister',
  component: GarantiesFinancièresListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<GarantiesFinancieresListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const getFilters = (defaultValue: GarantiesFinancièresListItemProps['statut']) => [
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
    label: 'Statut',
    searchParamKey: 'statut',
    defaultValue,
    options: [
      { label: 'En attente', value: 'en attente' },
      { label: 'À traiter', value: 'à traiter' },
      { label: 'Validé', value: 'validé' },
    ],
  },
];

const list = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 10,
};

export const SoumissionEnAttente: Story = {
  args: {
    filters: getFilters('en attente'),
    list: {
      ...list,
      items: [
        {
          identifiantProjet: '#identifiantProjet-1',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'en attente',
          misÀJourLe: '2023-02-12',
        },
        {
          identifiantProjet: '#identifiantProjet-3',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'en attente',
          misÀJourLe: '2023-02-12',
        },
      ],
    },
  },
};

export const SoumissionATraiter: Story = {
  args: {
    filters: getFilters('à traiter'),
    list: {
      ...list,
      items: [
        {
          identifiantProjet: '#identifiantProjet-1',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'à traiter',
          misÀJourLe: '2023-02-12',
        },
        {
          identifiantProjet: '#identifiantProjet-3',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'à traiter',
          misÀJourLe: '2023-02-12',
        },
      ],
    },
  },
};

export const SoumissionValidée: Story = {
  args: {
    filters: getFilters('validé'),
    list: {
      ...list,
      items: [
        {
          identifiantProjet: '#identifiantProjet-1',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'validé',
          misÀJourLe: '2023-02-12',
        },
        {
          identifiantProjet: '#identifiantProjet-2',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'validé',
          misÀJourLe: '2023-02-12',
        },
      ],
    },
  },
};
