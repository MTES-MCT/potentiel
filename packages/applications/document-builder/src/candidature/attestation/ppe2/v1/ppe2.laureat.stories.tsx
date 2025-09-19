import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line no-restricted-imports
import {
  autoconsommationMetropolePPE2,
  batimentPPE2,
  eolienPPE2,
  innovationPPE2,
  neutrePPE2,
  solPPE2,
} from '@potentiel-domain/inmemory-referential/src/appelOffre/PPE2';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationPPE2Options } from '../../AttestationCandidatureOptions';

import { makeCertificate } from './makeCertificate';

const meta = {
  title: 'Attestations PDF/PPE2/v1',
  component: ({ projet }: { projet: AttestationPPE2Options }) => {
    return makeCertificate(
      projet,
      {
        nomComplet: 'Nom du signataire',
        fonction: 'fonction du signataire',
      },
      '/images',
    );
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const fakeProject: AttestationPPE2Options = {
  template: 'ppe2.v1',
  appelOffre: {} as AppelOffre.AppelOffreReadModel,
  période: {} as AppelOffre.Periode,
  famille: { id: 'famille' } as AppelOffre.Famille,
  isClasse: true,
  prixReference: 42,
  evaluationCarbone: 42,
  engagementFournitureDePuissanceAlaPointe: true,
  motifsElimination: 'motifsElimination',
  notifiedOn: Date.now(),
  nomRepresentantLegal: 'nomRepresentantLegal',
  nomCandidat: 'nomCandidat',
  email: 'email',
  nomProjet: 'nomProjet',
  adresseProjet: 'adresseProjet',
  codePostalProjet: 'codePostalProjet',
  communeProjet: 'communeProjet',
  puissance: 42,
  potentielId: 'potentielId',
  technologie: 'pv',
  unitePuissance: 'MWc',
  coefficientKChoisi: undefined,
  autorisationDUrbanisme: undefined,
};

export const LaureatPPE2AutoconsommationMétropoleFinancementCollectif: Story = {
  args: {
    projet: {
      ...fakeProject,
      actionnariat: 'financement-collectif',
      appelOffre: autoconsommationMetropolePPE2,
      période: autoconsommationMetropolePPE2.periodes[0],
    },
  },
};

export const LaureatPPE2BatimentGouvernancePartagee: Story = {
  args: {
    projet: {
      ...fakeProject,
      actionnariat: 'gouvernance-partagée',
      appelOffre: batimentPPE2,
      période: batimentPPE2.periodes[0],
    },
  },
};

export const LaureatPPE2Eolien: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: eolienPPE2,
      période: eolienPPE2.periodes[0],
    },
  },
};

export const LaureatPPE2Innovation: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: innovationPPE2,
      période: innovationPPE2.periodes[0],
    },
  },
};

export const LaureatPPE2Neutre: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: neutrePPE2,
      période: neutrePPE2.periodes[0],
    },
  },
};

export const LaureatPPE2Sol: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: solPPE2,
      période: solPPE2.periodes[0],
    },
  },
};
