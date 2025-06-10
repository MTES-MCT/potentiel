import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueRecoursProjetQuery } from './lister/listerHistoriqueRecoursProjet.query';

// Query
export type HistoriqueQuery = ListerHistoriqueProjetQuery | ListerHistoriqueRecoursProjetQuery;
export type { ListerHistoriqueProjetQuery, ListerHistoriqueRecoursProjetQuery };

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
  AbandonHistoryRecord,
  ActionnaireHistoryRecord,
  HistoryReadModel,
  ProducteurHistoryRecord,
  PuissanceHistoryRecord,
  ReprésentantLégalHistoryRecord,
  GarantiesFinancièresHistoryRecord,
} from './lister/listerHistoriqueProjet.query';
export type {
  ListerHistoriqueRecoursProjetReadModel,
  HistoriqueRecoursProjetListItemReadModel,
} from './lister/listerHistoriqueRecoursProjet.query';

// register
export * from './register';
