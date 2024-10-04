import type { Meta, StoryObj } from '@storybook/react';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';
import { makeCertificate } from './makeCertificate';

const meta = {
  title: 'Attestations PDF',
  component: ({ appelOffre, isClasse, periode }) => {
    const data = {
      ...fakeProject(appelOffre, periode),
      isClasse,
    };
    return makeCertificate({
      data,
      validateur,
      imagesFolderPath: '/images',
    });
  },
  argTypes: {
    appelOffre: {
      control: 'select',
      options: appelsOffreData.map((x) => x.id),
    },
    periode: {
      control: 'select',
      options: [...new Set(appelsOffreData.map((x) => x.periodes.map((p) => p.id)).flat())],
    },
  },
} satisfies Meta<{
  appelOffre: string;
  periode: string;
  isClasse: boolean;
}>;

export default meta;

type Story = StoryObj<typeof meta>;

const fakeProject = (appelOffreId: string, périodeId?: string): AttestationCandidatureOptions => {
  const appelOffre = appelsOffreData.find((x) => x.id === appelOffreId)!;
  const période = appelOffre.periodes.find((x) => x.id === périodeId) ?? appelOffre.periodes[0];
  const data = {
    appelOffre,
    période,
    famille: période.familles[0],
    isClasse: true,
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
    technologie: 'N/A',
  } satisfies Partial<AttestationCandidatureOptions>;
  if (!période.certificateTemplate || période.certificateTemplate === 'ppe2.v2') {
    return {
      template: 'ppe2.v2',
      ministère: période.certificateTemplate === 'ppe2.v2' ? période.ministère : 'MCE',
      ...data,
    };
  }
  return {
    template: période.certificateTemplate,
    ...data,
  };
};

const validateur = {
  fullName: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as AppelOffre.Validateur;

export const Générique: Story = {
  args: {
    appelOffre: appelsOffreData[0].id,
    isClasse: true,
    periode: '1',
  },
};
