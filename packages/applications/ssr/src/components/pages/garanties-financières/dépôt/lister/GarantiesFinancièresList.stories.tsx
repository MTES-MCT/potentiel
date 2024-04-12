import type { Meta, StoryObj } from '@storybook/react';

import { getGarantiesFinancièresTypeLabel } from '../../getGarantiesFinancièresTypeLabel';

import {
  GarantiesFinancièresDépôtsEnCoursListPage,
  GarantiesFinancièresDépôtsEnCoursListProps,
} from './GarantiesFinancièresDépôtsEnCoursList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Dépôt',
  component: GarantiesFinancièresDépôtsEnCoursListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<GarantiesFinancièresDépôtsEnCoursListProps>;

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

export const Liste: Story = {
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
          statut: 'en-cours',
          misÀJourLe: '2023-02-12',
          type: getGarantiesFinancièresTypeLabel('consignation'),
          régionProjet: 'Région A / Région B',
        },
        {
          identifiantProjet: '#identifiantProjet-3',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'en-cours',
          misÀJourLe: '2023-02-12',
          type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
          dateÉchéance: '2023-02-12',
          régionProjet: 'Région A / Région B',
        },
      ],
    },
  },
};
