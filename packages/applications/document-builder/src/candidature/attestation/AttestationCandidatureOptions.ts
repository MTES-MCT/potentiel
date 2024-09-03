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
};

export type AttestationCRE4Options = Common & {
  template: 'cre4.v0' | 'cre4.v1';
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
};

export type AttestationPPE2Options = Common & {
  template: 'ppe2.v1' | 'ppe2.v2';
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee';
};

export type AttestationCandidatureOptions = AttestationCRE4Options | AttestationPPE2Options;
