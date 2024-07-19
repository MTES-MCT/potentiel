import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { AbandonListPage, AbandonListPageProps } from './AbandonList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Abandon/Lister/AbandonListPage',
  component: AbandonListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<AbandonListPageProps>;

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
        label: 'Recandidature',
        searchParamKey: 'recandidature',
        defaultValue: undefined,
        options: [
          {
            label: 'Avec recandidature',
            value: 'true',
          },
          {
            label: 'Sans recandidature',
            value: 'false',
          },
        ],
      },
      {
        label: 'Preuve de recandidature',
        searchParamKey: 'preuveRecandidatureStatut',
        defaultValue: undefined,
        options: [
          {
            label: 'Transmise',
            value: 'transmis',
          },
          {
            label: 'En attente',
            value: 'en-attente',
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
    list: {
      currentPage: 1,
      items: [
        {
          identifiantProjet: '#identifiantProjet-1',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'accordé',
          recandidature: false,
          preuveRecandidatureStatut: 'en-attente',
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
        },
        {
          identifiantProjet: '#identifiantProjet-2',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'demandé',
          recandidature: true,
          preuveRecandidatureStatut: 'en-attente',
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
        },
        {
          identifiantProjet: '#identifiantProjet-3',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          statut: 'rejeté',
          recandidature: false,
          preuveRecandidatureStatut: 'en-attente',
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
        },
      ],
      itemsPerPage: 10,
      totalItems: 10,
    },
  },
};
