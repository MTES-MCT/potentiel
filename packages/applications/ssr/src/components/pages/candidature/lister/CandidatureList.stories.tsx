import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureListPage, CandidatureListPageProps } from './CandidatureList.page';

const meta = {
  title: 'Pages/Candidature/Lister/CandidatureListPage',
  component: CandidatureListPage,
  parameters: {
    docs: {
      description: {
        component: 'Cette page liste les candidatures à notifier',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<CandidatureListPageProps>;

export default meta;
type Story = StoryObj<typeof meta>;

type CommonItem = CandidatureListPageProps['list']['items'][number] &
  Pick<AppelOffre.AppelOffreReadModel, 'unitePuissance'>;

const commonItem: CommonItem = {
  identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
  statut: StatutProjet.classé,
  nomProjet: 'Nom projet',
  nomCandidat: 'Candidat',
  emailContact: 'porteur@test.test',
  codePostal: '13000',
  commune: 'MARSEILLE',
  puissanceProductionAnnuelle: 1,
  unitePuissance: 'MWc',
  prixReference: 1,
  nomReprésentantLégal: 'Frodon Sacquet',
  evaluationCarboneSimplifiée: 1,
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
      items: [
        {
          ...commonItem,
        },
        {
          ...commonItem,
          statut: StatutProjet.éliminé,
        },
        {
          ...commonItem,
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
