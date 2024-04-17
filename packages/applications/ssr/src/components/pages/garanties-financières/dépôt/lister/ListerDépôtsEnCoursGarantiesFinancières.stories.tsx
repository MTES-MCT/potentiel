import type { Meta, StoryObj } from '@storybook/react';

import { getGarantiesFinancièresTypeLabel } from '../../getGarantiesFinancièresTypeLabel';

import {
  ListDépôtsEnCoursGarantiesFinancièresPage,
  ListDépôtsEnCoursGarantiesFinancièresProps,
} from './ListerDépôtsEnCoursGarantiesFinancières.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Dépôt/Lister',
  component: ListDépôtsEnCoursGarantiesFinancièresPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<ListDépôtsEnCoursGarantiesFinancièresProps>;

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
          statut: 'en-cours',
          misÀJourLe: '12/02/2023',
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
          misÀJourLe: '12/02/2023',
          type: getGarantiesFinancièresTypeLabel('avec-date-échéance'),
          dateÉchéance: '12/02/2023',
          régionProjet: 'Région A / Région B',
        },
      ],
    },
  },
};
