import type { Meta, StoryObj } from '@storybook/react';

import { DateTime } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import {
  ChangementReprésentantLégalListPage,
  ChangementReprésentantLégalListPageProps,
} from './ChangementReprésentantLégalList.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ChangementReprésentantLégal/Lister',
  component: ChangementReprésentantLégalListPage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<ChangementReprésentantLégalListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: ChangementReprésentantLégalListPageProps['list']['items'] = [
  {
    identifiantChangement: 'id-changement',
    identifiantProjet: mapToPlainObject({
      appelOffre: `Appel d'offre 1`,
      période: `1`,
      famille: ``,
      numéroCRE: `1`,
    }),
    nomProjet: `Nom projet 1`,
    statut: mapToPlainObject(ReprésentantLégal.StatutChangementReprésentantLégal.accordé),
    misÀJourLe: mapToPlainObject(DateTime.now()),
  },
  {
    identifiantChangement: 'id-changement',
    identifiantProjet: mapToPlainObject({
      appelOffre: `Appel d'offre 2`,
      période: `2`,
      famille: ``,
      numéroCRE: `2`,
    }),
    nomProjet: `Nom projet 2`,
    statut: mapToPlainObject(ReprésentantLégal.StatutChangementReprésentantLégal.demandé),
    misÀJourLe: mapToPlainObject(DateTime.now()),
  },
  {
    identifiantChangement: 'id-changement',
    identifiantProjet: mapToPlainObject({
      appelOffre: `Appel d'offre 3`,
      période: `3`,
      famille: ``,
      numéroCRE: `3`,
    }),
    nomProjet: `Nom projet 3`,
    statut: mapToPlainObject(ReprésentantLégal.StatutChangementReprésentantLégal.rejeté),
    misÀJourLe: mapToPlainObject(DateTime.now()),
  },
];

export const Default: Story = {
  args: {
    filters: [
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
        label: `Période`,
        searchParamKey: 'periode',
        options: [
          {
            label: 'Période 1',
            value: 'periode-1',
          },
          {
            label: 'Période 2',
            value: 'periode-2',
          },
        ],
      },
      {
        label: 'Statut',
        searchParamKey: 'statut',
        options: [
          { label: 'Statut 1', value: 'statut-1' },
          { label: 'Statut 2', value: 'statut-2' },
          { label: 'Statut 3', value: 'statut-3' },
        ],
      },
    ],
    list: {
      items,
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
      },
      total: items.length,
    },
  },
};
