import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line no-restricted-imports
import {
  autoconsommationMetropolePPE2,
  batimentPPE2,
  eolienPPE2,
  innovationPPE2,
  neutrePPE2,
  petitPVBâtimentPPE2,
  solPPE2,
} from '@potentiel-domain/inmemory-referential/src/appelOffre/PPE2';

import { AttestationPPE2V2Options } from '../../AttestationCandidatureOptions';

import { makeCertificate } from './makeCertificate';

const meta = {
  title: 'Attestations PDF/PPE2/v2',
  component: ({ projet }: { projet: AttestationPPE2V2Options }) => {
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

const fakeProject = {
  template: 'ppe2.v2',
  logo: 'Gouvernement',
  famille: undefined,
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
} satisfies Omit<AttestationPPE2V2Options, 'période' | 'appelOffre' | 'cahierDesCharges'>;

export const LaureatPPE2AutoconsommationMétropoleFinancementCollectif: Story = {
  args: {
    projet: {
      ...fakeProject,
      actionnariat: 'financement-collectif',
      appelOffre: autoconsommationMetropolePPE2,
      période: autoconsommationMetropolePPE2.periodes[0],
      famille: autoconsommationMetropolePPE2.periodes[0].familles[0],
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
      famille: batimentPPE2.periodes[0].familles[0],
    },
  },
};

export const LaureatPPE2EolienP1: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: eolienPPE2,
      période: eolienPPE2.periodes[0],
    },
  },
};

export const LaureatPPE2EolienP2: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: eolienPPE2,
      période: eolienPPE2.periodes[1],
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

export const LaureatPPE2BatimentAvecCoefficientK: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: batimentPPE2,
      période: batimentPPE2.periodes[8],
      actionnariat: 'gouvernance-partagée',
      coefficientKChoisi: true,
    },
  },
};

export const LaureatPPE2PetitPVP1: Story = {
  args: {
    projet: {
      ...fakeProject,
      appelOffre: petitPVBâtimentPPE2,
      période: petitPVBâtimentPPE2.periodes[0],
      autorisationDUrbanisme: { numéro: 'URB-12345', date: new Date('2024-01-01') },
    },
  },
};
