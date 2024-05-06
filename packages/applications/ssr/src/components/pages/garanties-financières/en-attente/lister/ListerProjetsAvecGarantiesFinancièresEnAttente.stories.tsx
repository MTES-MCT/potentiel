import type { Meta, StoryObj } from '@storybook/react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { getGarantiesFinancièresMotifLabel } from '../../getGarantiesFinancièresMotifLabel';

import {
  ListProjetsAvecGarantiesFinancièresEnAttentePage,
  ListProjetsAvecGarantiesFinancièresEnAttenteProps,
} from './ListerProjetsAvecGarantiesFinancièresEnAttente.page';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Garanties-financières/Projets en attente/Lister',
  component: ListProjetsAvecGarantiesFinancièresEnAttentePage,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    list: {},
  },
} satisfies Meta<ListProjetsAvecGarantiesFinancièresEnAttenteProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const filters: ListProjetsAvecGarantiesFinancièresEnAttenteProps['filters'] = [
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
        label: 'App`el offre 2',
        value: 'appel-offre-2',
      },
    ],
  },
  {
    label: 'Motifs',
    searchParamKey: 'motif',
    defaultValue: undefined,
    options: GarantiesFinancières.MotifDemandeGarantiesFinancières.motifs.map((motif) => ({
      label: getGarantiesFinancièresMotifLabel(motif),
      value: motif,
    })),
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
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
          régionProjet: 'Région A / Région B',
          motif: 'Inconnu',
          dateLimiteSoumission: new Date('2025-02-12').toISOString() as Iso8601DateTime,
          afficherModèleMiseEnDemeure: false,
        },
        {
          identifiantProjet: '#identifiantProjet-3',
          appelOffre: 'Appel offre',
          période: 'Période',
          famille: 'Famille',
          nomProjet: 'Le projet',
          misÀJourLe: new Date('2023-02-12').toISOString() as Iso8601DateTime,
          régionProjet: 'Région A / Région B',
          motif: 'Recours accordé',
          dateLimiteSoumission: new Date('2023-02-12').toISOString() as Iso8601DateTime,
          afficherModèleMiseEnDemeure: true,
        },
      ],
    },
  },
};
