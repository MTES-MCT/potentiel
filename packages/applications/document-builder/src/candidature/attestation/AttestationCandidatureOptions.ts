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
  note: number;
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
  territoireProjet: string;
  technologie: AppelOffre.Technologie;
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  désignationCatégorie?: any; // DésignationCatégorie; TODO
};
