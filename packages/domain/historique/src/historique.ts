import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';

// Query
export type HistoriqueQuery = ListerHistoriqueProjetQuery;
export type { ListerHistoriqueProjetQuery };

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
  AbandonHistoryRecord,
  ActionnaireHistoryRecord,
  HistoryReadModel,
  ProducteurHistoryRecord,
  PuissanceHistoryRecord,
  RecoursHistoryRecord,
  ReprésentantLégalHistoryRecord,
} from './lister/listerHistoriqueProjet.query';

// register
export * from './register';
