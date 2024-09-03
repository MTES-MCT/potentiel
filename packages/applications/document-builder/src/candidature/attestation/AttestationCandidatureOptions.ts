import { AppelOffre } from '@potentiel-domain/appel-offre';

export type AttestationCandidatureOptions = {
  appelOffre: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  famille: AppelOffre.Famille | undefined;
  isClasse: boolean;
  prixReference: number;
  evaluationCarbone: number;
  isFinancementParticipatif: boolean;
  isInvestissementParticipatif: boolean;
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
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee';
  désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
};
