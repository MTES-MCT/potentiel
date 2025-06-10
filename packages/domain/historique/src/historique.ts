import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueRecoursProjetQuery } from './lister/listerHistoriqueRecoursProjet.query';
import { ListerHistoriqueAbandonProjetQuery } from './lister/listerHistoriqueAbandonProjet.query';
import { ListerHistoriqueProducteurProjetQuery } from './lister/listerHistoriqueProducteurProjet.query';

// Query
export type HistoriqueQuery =
  | ListerHistoriqueProjetQuery
  | ListerHistoriqueRecoursProjetQuery
  | ListerHistoriqueAbandonProjetQuery
  | ListerHistoriqueProducteurProjetQuery;
export type {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueRecoursProjetQuery,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueProducteurProjetQuery,
};

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
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
export type {
  ListerHistoriqueAbandonProjetReadModel,
  HistoriqueAbandonProjetListItemReadModel,
} from './lister/listerHistoriqueAbandonProjet.query';
export type {
  ListerHistoriqueProducteurProjetReadModel,
  HistoriqueProducteurProjetListItemReadModel,
} from './lister/listerHistoriqueProducteurProjet.query';

// register
export * from './register';
