import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line no-restricted-imports
import {
  batimentPPE2,
  eolienPPE2,
} from '@potentiel-domain/inmemory-referential/src/appelOffre/PPE2';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from '../../AttestationCandidatureOptions';

import { makeCertificate } from './makeCertificate';

const meta = {
  title: 'Attestations PDF/PPE2/v2',
  component: ({ projet }: { projet: AttestationCandidatureOptions }) => {
    return makeCertificate(
      projet,
      {
        fullName: 'Nom du signataire',
        fonction: 'fonction du signataire',
      },
      '/images',
    );
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const fakeProject: AttestationCandidatureOptions = {
  appelOffre: {
    ...eolienPPE2,
  } as AppelOffre.AppelOffreReadModel,
  période: eolienPPE2.periodes[0],
  famille: eolienPPE2.periodes[0].familles[0],
  isClasse: true,
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: true,
  isInvestissementParticipatif: true,
  engagementFournitureDePuissanceAlaPointe: true,
  motifsElimination: 'motifsElimination',
  note: 42,
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
  territoireProjet: 'territoireProjet',
  technologie: 'N/A',
};

export const EliminePPE2AuDessusDePcible: Story = {
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: 'Au-dessus de Pcible',
    },
  },
};

export const EliminePPE2DéjàLauréatNonInstruit: Story = {
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: 'Déjà lauréat - Non instruit',
    },
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
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: 'Autre motif',
    },
  },
};

export const EliminePPE2AutreMotifNonSoumisAuxGF: Story = {
  args: {
    projet: {
      ...fakeProject,
      isClasse: false,
      motifsElimination: 'Autre motif',
      appelOffre: {
        ...fakeProject.appelOffre,
        soumisAuxGarantiesFinancieres: 'non soumis',
      },
    },
  },
};
