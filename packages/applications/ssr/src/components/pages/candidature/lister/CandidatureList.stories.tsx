import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

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

type CommonItem = CandidatureListPageProps['items'][number];

const commonItem: CommonItem = {
  identifiantProjet: IdentifiantProjet.convertirEnValueType('PPE2 - Eolien#1##23'),
  statut: StatutProjet.classé,
  nomProjet: 'Nom projet',
  nomCandidat: 'Candidat',
  emailContact: 'porteur@test.test',
  localité: {
    commune: 'Commune',
    département: 'Département',
    région: 'Région',
  },
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
    items: [
      {
        ...commonItem,
        nomProjet:
          'Nom de projet très très très très très très très très très très très très très très très très long',
      },
      {
        ...commonItem,
        statut: StatutProjet.éliminé,
      },
      {
        ...commonItem,
        unitePuissance: 'inconnue',
      },
    ],
    range: {
      startPosition: 0,
      endPosition: 9,
    },
    total: 3,
  },
};
