import type { Meta, StoryObj } from '@storybook/react';

// eslint-disable-next-line no-restricted-imports
import { eolien } from '@potentiel-domain/inmemory-referential/src/appelOffre/CRE4';

import { AttestationCRE4Options } from '../../AttestationCandidatureOptions';

import { makeCertificate } from './makeCertificate';

const meta = {
  title: 'Attestations PDF/CRE4/v1',
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
  template: 'cre4.v1',
  appelOffre: eolien,
  période: eolien.periodes[0],
  isClasse: true,
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
  autorisationDUrbanisme: undefined,
};

export const ElimineAuDessusDePcible: Story = {
  args: { projet: { ...fakeProject, isClasse: false, motifsElimination: 'Au-dessus de Pcible' } },
};

export const ElimineDéjàLauréatNonInstruit: Story = {
  args: {
    projet: { ...fakeProject, isClasse: false, motifsElimination: 'Déjà lauréat - Non instruit' },
  },
};

export const Lauréat: Story = { args: { projet: fakeProject } };
