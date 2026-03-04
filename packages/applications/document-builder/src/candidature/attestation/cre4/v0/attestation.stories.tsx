import type { Meta, StoryObj } from '@storybook/react';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { AttestationCRE4Options } from '../../AttestationCandidatureOptions.js';

import { makeCertificate } from './makeCertificate.js';

const eolien = appelsOffreData.find((x) => x.id === 'Eolien')!;

const meta = {
  title: 'Attestations PDF/CRE4/v0',
  component: ({ projet }) => {
    return makeCertificate(
      projet,
      {
        nomComplet: 'Nom du signataire',
        fonction: 'fonction du signataire',
      },
      '/images',
    );
  },
} satisfies Meta<{ projet: AttestationCRE4Options }>;

export default meta;

type Story = StoryObj<typeof meta>;

const fakeProject: AttestationCRE4Options = {
  template: 'cre4.v0',
  appelOffre: eolien,
  période: eolien.periodes[0],
  isClasse: false,
  famille: eolien.periodes[0].familles[0],
  prixReference: 42,
  evaluationCarbone: 42,
  isFinancementParticipatif: true,
  isInvestissementParticipatif: true,
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
  autorisation: undefined,
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

export const Lauréat: Story = {
  args: {
    projet: fakeProject,
  },
};
