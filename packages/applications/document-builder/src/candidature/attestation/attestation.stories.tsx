import type { Meta, StoryObj } from '@storybook/react';

import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';

import { AttestationCandidatureOptions } from './AttestationCandidatureOptions.js';
import { makeCertificate } from './makeCertificate.js';

const meta = {
  title: 'Attestations PDF',
  component: ({ appelOffre, isClasse, periode }) => {
    const data: AttestationCandidatureOptions = {
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
    typeActionnariat: {
      control: 'select',
      options: Candidature.TypeActionnariat.types,
    },
  },
} satisfies Meta<{
  appelOffre: string;
  periode?: string;
  isClasse: boolean;
  typeActionnariat?: Candidature.TypeActionnariat.RawType;
}>;

export default meta;

type Story = StoryObj<typeof meta>;

const fakeProject = (appelOffreId: string, périodeId?: string): AttestationCandidatureOptions => {
  const appelOffre = appelsOffreData.find((x) => x.id === appelOffreId)!;
  const période =
    appelOffre.periodes.find((x) => x.id === périodeId) ??
    appelOffre.periodes[appelOffre.periodes.length - 1];
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
    technologie: 'eolien',
    unitePuissance: 'MW',
    coefficientKChoisi: undefined,
    autorisation: undefined,
  } satisfies Partial<AttestationCandidatureOptions>;
  if (!période.certificateTemplate || période.certificateTemplate === 'ppe2.v2') {
    return {
      template: 'ppe2.v2',
      logo: période.certificateTemplate === 'ppe2.v2' ? période.logo : 'MCE',
      ...data,
    };
  }
  return {
    template: période.certificateTemplate,
    ...data,
  };
};

const validateur = {
  nomComplet: 'Nom du signataire',
  fonction: 'fonction du signataire',
} as AppelOffre.Validateur;

export const Générique: Story = {
  args: {
    appelOffre: 'PPE2 - Eolien',
    isClasse: true,
    periode: undefined,
    typeActionnariat: undefined,
  },
};
