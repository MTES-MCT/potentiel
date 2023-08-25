import { UtilisateurReadModel } from '../../utilisateur/récupérer/UtilisateurReadModel';
import { PaginatedList, Pagination } from '../../pagination';
import { AppelOffre, Periode, Famille } from '@potentiel/domain-views';
import { GarantiesFinancièresListItem } from '../dtos/garantiesFinancières.dtos';

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
