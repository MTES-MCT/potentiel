import type { Meta, StoryObj } from '@storybook/react';

import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
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
  motifÉlimination: '',
  typeGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.consignation,
  nomProjet: 'Nom projet',
  nomCandidat: 'Candidat',
  technologie: Candidature.Technologie.nonApplicable,
  emailContact: 'porteur@test.test',
  codePostal: '13000',
  commune: 'MARSEILLE',
  adresse1: '5 avenue laeticia',
  adresse2: '',
  puissanceALaPointe: true,
  sociétéMère: '',
  territoireProjet: '',
  dateÉchéanceGf: undefined,
  historiqueAbandon: Candidature.HistoriqueAbandon.premièreCandidature,
  puissanceProductionAnnuelle: 1,
  unitePuissance: 'MWc',
  prixReference: 1,
  noteTotale: 1,
  nomReprésentantLégal: 'Frodon Sacquet',
  evaluationCarboneSimplifiée: 1,
  valeurÉvaluationCarbone: 1,
  financementCollectif: true,
  gouvernancePartagée: true,
  financementParticipatif: true,
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
