import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { RecoursListPage, RecoursListPageProps } from './RecoursList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Lister/AbandonListPage',
  component: RecoursListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<RecoursListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: [
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
        defaultValue: 'statut-1',
        options: [
          { label: 'Statut 1', value: 'statut-1' },
          { label: 'Statut 2', value: 'statut-2' },
          { label: 'Statut 3', value: 'statut-3' },
        ],
      },
    ],
    items: [
      {
        identifiantProjet: {
          appelOffre: 'CRE4 - Autoconsommation métropole 2016',
          numéroCRE: '200-2',
          famille: '',
          période: '2',
        },
        appelOffre: 'CRE4 - Autoconsommation métropole 2016',
        période: '2',
        nomProjet: 'Le projet',
        statut: { value: 'accordé' },
        misÀJourLe: { date: new Date('2023-02-12').toISOString() as Iso8601DateTime },
      },
      {
        identifiantProjet: {
          appelOffre: 'Appel offre',
          famille: '2',
          numéroCRE: 'id-2',
          période: '1',
        },
        appelOffre: 'Appel offre',
        période: '1',
        nomProjet: 'Le projet',
        statut: { value: 'demandé' },
        misÀJourLe: { date: new Date('2023-02-12').toISOString() as Iso8601DateTime },
      },
      {
        identifiantProjet: {
          appelOffre: 'Appel offre',
          famille: '2',
          numéroCRE: 'id-3',
          période: '1',
        },
        appelOffre: 'Appel offre',
        période: '1',
        nomProjet: 'Le projet',
        statut: { value: 'rejeté' },
        misÀJourLe: { date: new Date('2023-02-12').toISOString() as Iso8601DateTime },
      },
    ],
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
    },
    total: 10,
  },
};
