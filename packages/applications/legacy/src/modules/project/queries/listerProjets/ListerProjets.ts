import { UtilisateurReadModel } from '../../../utilisateur/récupérer/UtilisateurReadModel';
import { ProjectAppelOffre } from '../../../../entities';
import { PaginatedList, Pagination } from '../../../pagination';
import { AppelOffre, Periode, Famille } from '@potentiel-domain/appel-offre';

export const PermissionListerProjets = {
  nom: 'lister-projets',
  description: 'Lister les projets',
};

export type ProjectListItem = {
  id: string;
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
    unitePuissance: ProjectAppelOffre['unitePuissance'];
    periode: ProjectAppelOffre['periode'];
    changementProducteurPossibleAvantAchèvement: ProjectAppelOffre['changementProducteurPossibleAvantAchèvement'];
  };
  prixReference?: number;
  evaluationCarbone?: number;
  classe: 'Classé' | 'Eliminé';
  abandonedOn: number;
  notifiedOn: number;
  isFinancementParticipatif?: boolean;
  isInvestissementParticipatif?: boolean;
  actionnariat?: 'financement-collectif' | 'gouvernance-partagee' | '';
};

export type FiltreListeProjets = {
  recherche?: string;
  appelOffre?: {
    appelOffreId?: AppelOffre['id'];
    periodeId?: Periode['id'];
    familleId?: Famille['id'];
  };
  classement?: 'classés' | 'éliminés' | 'abandons';
  reclames?: 'réclamés' | 'non-réclamés';
};

export type ListerProjets = (args: {
  user: UtilisateurReadModel;
  pagination: Pagination;
  filtres?: FiltreListeProjets;
}) => Promise<PaginatedList<ProjectListItem>>;
