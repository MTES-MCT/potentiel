import { UtilisateurReadModel } from '../../../utilisateur/récupérer/UtilisateurReadModel';
import { ProjectAppelOffre } from '../../../../entities';
import { PaginatedList, Pagination } from '../../../pagination';
import { AppelOffre, Periode, Famille } from '@potentiel/domain-views';

export type GarantiesFinancièresListItem = {
  id: string;
  nomProjet: string;
  potentielIdentifier: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
  nomCandidat: string;
  nomRepresentantLegal: string;
  email: string;
  appelOffre?: {
    title?: ProjectAppelOffre['title'];
    type: ProjectAppelOffre['typeAppelOffre'];
    periode: ProjectAppelOffre['periode'];
  };
  garantiesFinancières?: {
    id: string;
    dateEnvoi?: string;
    statut: 'en attente' | 'à traiter' | 'validé';
    fichier?: {
      id: string;
      filename: string;
    };
  };
};

export type FiltreListeGarantiesFinancières = {
  recherche?: string;
  appelOffre?: {
    appelOffreId?: AppelOffre['id'];
    periodeId?: Periode['id'];
    familleId?: Famille['id'];
  };
  classement?: 'classés' | 'éliminés' | 'abandons';
  reclames?: 'réclamés' | 'non-réclamés';
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue';
};

export type ListerGarantiesFinancièresPourDreal = (args: {
  user: UtilisateurReadModel;
  pagination: Pagination;
  filtres?: FiltreListeGarantiesFinancières;
}) => Promise<PaginatedList<GarantiesFinancièresListItem>>;
