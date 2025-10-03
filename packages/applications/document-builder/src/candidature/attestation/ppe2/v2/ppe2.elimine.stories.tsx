import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line no-restricted-imports
import {
  batimentPPE2,
  eolienPPE2,
} from '@potentiel-domain/inmemory-referential/src/appelOffre/PPE2';
import { AppelOffre } from '@potentiel-domain/appel-offre';

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
  appelOffre: eolienPPE2 as AppelOffre.AppelOffreReadModel,
  période: eolienPPE2.periodes[0],
  famille: eolienPPE2.periodes[0].familles[0],
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
  unitePuissance: 'MW',
  coefficientKChoisi: undefined,
  autorisationDUrbanisme: undefined,
} satisfies AttestationPPE2V2Options;

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
        garantiesFinancières: {
          soumisAuxGarantiesFinancieres: 'non soumis',
          typeGarantiesFinancièresDisponibles: [],
          renvoiRetraitDesignationGarantieFinancieres: '',
        },
      },
    },
  },
};
