import type { Meta, StoryObj } from '@storybook/react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { Candidature } from '@potentiel-domain/projet';

import type { AttestationCandidatureOptions } from './AttestationCandidatureOptions.js';
import { makeCertificate } from './makeCertificate.js';

const meta = {
  title: 'Attestations PDF',
  component: ({ appelOffre, isClasse, periode, typeActionnariat }) => {
    const data: AttestationCandidatureOptions = {
      ...fakeProject(appelOffre, periode, typeActionnariat),
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
      options: [...new Set(appelsOffreData.flatMap((x) => x.periodes.map((p) => p.id)))],
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

const fakeProject = (
  appelOffreId: string,
  périodeId: string | undefined,
  typeActionnariat: Candidature.TypeActionnariat.RawType | undefined,
): AttestationCandidatureOptions => {
  const appelOffre = appelsOffreData.find((x) => x.id === appelOffreId)!;
  const période =
    appelOffre.periodes.find((x) => x.id === périodeId) ??
    appelOffre.periodes[appelOffre.periodes.length - 1];
  const actionnariat = typeActionnariat
    ? Candidature.TypeActionnariat.convertirEnValueType(typeActionnariat)
    : undefined;

  const data = {
    appelOffre,
    période,
    famille: période.familles[0],
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
    technologie: 'eolien',
    unitePuissance: 'MW',
    coefficientKChoisi: undefined,
    autorisation: undefined,
  } satisfies Partial<AttestationCandidatureOptions>;

  if (période.certificateTemplate === 'cre4.v0' || période.certificateTemplate === 'cre4.v1') {
    return {
      template: période.certificateTemplate,
      isFinancementParticipatif: actionnariat?.estFinancementParticipatif() ?? false,
      isInvestissementParticipatif: actionnariat?.estInvestissementParticipatif() ?? false,
      ...data,
    };
  }

  return {
    template: période.certificateTemplate ?? 'ppe2.v2',
    logo: période.certificateTemplate === 'ppe2.v2' ? période.logo : 'MCE',
    isFinancementCollectif: actionnariat?.estFinancementCollectif() ?? false,
    isGouvernancePartagée: actionnariat?.estGouvernancePartagée() ?? false,
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
