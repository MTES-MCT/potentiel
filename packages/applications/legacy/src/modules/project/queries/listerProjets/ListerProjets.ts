import { UtilisateurReadModel } from '../../../utilisateur/récupérer/UtilisateurReadModel';
import { ProjectAppelOffre } from '../../../../entities';
import { PaginatedList, Pagination } from '../../../pagination';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const PermissionListerProjets = {
  nom: 'lister-projets',
  description: 'Lister les projets',
};

export type ProjectListItem = {
  id: string;
  appelOffreId: AppelOffre.AppelOffreReadModel['id'];
  periodeId: AppelOffre.AppelOffreReadModel['periodes'][0]['id'];
  familleId: AppelOffre.AppelOffreReadModel['periodes'][0]['familles'][0]['id'];
  numeroCRE: string;
  nomProjet: string;
  potentielIdentifier: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
  nomCandidat: string;
  nomRepresentantLegal: string;
  email: string;
  puissance: number;
  appelOffre?: {
    title?: ProjectAppelOffre['title'];
    type: ProjectAppelOffre['typeAppelOffre'];
    periode: ProjectAppelOffre['periode'];
  };
  prixReference?: number;
  evaluationCarbone?: number;
  classe: 'Classé' | 'Eliminé';
  abandonedOn: number;
  notifiedOn: number;
  isFinancementParticipatif?: boolean;
  isInvestissementParticipatif?: boolean;
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee' | '';
  unitéPuissance: AppelOffre.UnitéPuissance | 'N/A';
};

export type FiltreListeProjets = {
  recherche?: string;
  appelOffre?: {
    appelOffreId?: AppelOffre.AppelOffreReadModel['id'];
    periodeId?: AppelOffre.Periode['id'];
    familleId?: AppelOffre.Famille['id'];
  };
  classement?: 'classé' | 'actif' | 'abandonné' | 'éliminé';
  régions?: Array<string>;
};

export type ListerProjets = (args: {
  user: UtilisateurReadModel;
  pagination: Pagination;
  filtres?: FiltreListeProjets;
}) => Promise<PaginatedList<ProjectListItem>>;
