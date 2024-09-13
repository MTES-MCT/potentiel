import type { Meta, StoryObj } from '@storybook/react';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

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
  statut: Candidature.StatutCandidature.classé,
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
  estNotifiée: true,
  estPériodeLegacy: false,
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
        estNotifiée: false,
        nomProjet:
          'Nom de projet très très très très très très très très très très très très très très très très long (et non notifié de surcroît)',
      },
      {
        ...commonItem,
        estNotifiée: false,
        estPériodeLegacy: true,
        nomProjet: 'Un projet de période legacy sans modèle',
      },
      {
        ...commonItem,
        statut: Candidature.StatutCandidature.éliminé,
      },
      {
        ...commonItem,
        unitePuissance: 'inconnue',
        evaluationCarboneSimplifiée: 0,
      },
    ],
    range: {
      startPosition: 0,
      endPosition: 9,
    },
    total: 3,
  },
};
