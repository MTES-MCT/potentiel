import { AppelOffre } from '@potentiel-domain/appel-offre';

export type Common = {
  appelOffre: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  famille: AppelOffre.Famille | undefined;
  isClasse: boolean;
  prixReference: number;
  evaluationCarbone: number;

  engagementFournitureDePuissanceAlaPointe: boolean;
  motifsElimination: string;
  notifiedOn: number;
  nomRepresentantLegal: string;
  nomCandidat: string;
  email: string;
  nomProjet: string;
  adresseProjet: string;
  codePostalProjet: string;
  communeProjet: string;
  puissance: number;
  potentielId: string;
  technologie: AppelOffre.Technologie;
  désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
  coefficientKChoisi: boolean | undefined;
  autorisationDUrbanisme: { date: Date; numéro: string } | undefined;

  unitePuissance: AppelOffre.UnitéPuissance;
};

export type AttestationCRE4Options = Common & {
  template: 'cre4.v0' | 'cre4.v1';
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
};

type PPE2BaseOptions = Common & {
  actionnariat?: 'financement-collectif' | 'gouvernance-partagée';
};
export type AttestationPPE2V1Options = PPE2BaseOptions & {
  template: 'ppe2.v1';
};
export type AttestationPPE2V2Options = PPE2BaseOptions & {
  template: 'ppe2.v2';
  logo: 'MEFSIN' | 'MCE' | 'Gouvernement';
};
export type AttestationPPE2Options = AttestationPPE2V1Options | AttestationPPE2V2Options;

export type AttestationCandidatureOptions = AttestationCRE4Options | AttestationPPE2Options;
