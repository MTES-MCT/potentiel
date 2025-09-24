import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line no-restricted-imports
import {
  batimentPPE2,
  eolienPPE2,
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
  appelOffre: eolienPPE2,
  période: eolienPPE2.periodes[0],
  isClasse: true,
  famille: eolienPPE2.periodes[0].familles[0],
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
  technologie: 'eolien',
  unitePuissance: 'MW',
  coefficientKChoisi: undefined,
  autorisationDUrbanisme: undefined,
};

export const EliminePPE2AuDessusDePcible: Story = {
  args: { projet: { ...fakeProject, isClasse: false, motifsElimination: 'Au-dessus de Pcible' } },
};

export const EliminePPE2DéjàLauréatNonInstruit: Story = {
  args: {
    projet: { ...fakeProject, isClasse: false, motifsElimination: 'Déjà lauréat - Non instruit' },
  },
};

export const EliminePPE2CompetitiviteBatimentPuissanceInferieureVolumeReserves: Story = {
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: '20% compétitivité',
      puissance: 0.5,
      appelOffre: batimentPPE2,
      période: {
        ...batimentPPE2.periodes[0],
        noteThreshold: {
          volumeReserve: {
            noteThreshold: 99,
            puissanceMax: 1,
          },
          autres: {
            noteThreshold: 89,
          },
        },
      } as AppelOffre.Periode,
    },
  },
};

export const EliminePPE2CompetitiviteBatimentPuissanceSuperieureVolumeReserves: Story = {
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: '20% compétitivité',
      puissance: 3,
      appelOffre: batimentPPE2,
      période: {
        ...batimentPPE2.periodes[0],
        noteThreshold: {
          volumeReserve: {
            noteThreshold: 99,
            puissanceMax: 1,
          },
          autres: {
            noteThreshold: 89,
          },
        },
      } as AppelOffre.Periode,
    },
  },
};

export const EliminePPE2AutreMotif: Story = {
  args: { projet: { ...fakeProject, isClasse: false, motifsElimination: 'Autre motif' } },
};

export const EliminePPE2AutreMotifNonSoumisAuxGF: Story = {
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: 'Autre motif',
      appelOffre: {
        ...fakeProject.appelOffre,
        garantiesFinancières: {
          typeGarantiesFinancièresDisponibles: [],
          soumisAuxGarantiesFinancieres: 'non soumis',
          renvoiRetraitDesignationGarantieFinancieres: '',
        },
      },
    },
  },
};
