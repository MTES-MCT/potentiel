import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueReprésentantLégalProjetQuery } from './lister/listerHistoriqueReprésentantLégalProjet.query';
import { ListerHistoriqueRaccordementProjetQuery } from './lister/listerHistoriqueRaccordementProjet.query';

// Query
export type HistoriqueQuery =
  | ListerHistoriqueProjetQuery
  | ListerHistoriqueReprésentantLégalProjetQuery
  | ListerHistoriqueRaccordementProjetQuery;

export type {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueReprésentantLégalProjetQuery,
  ListerHistoriqueRaccordementProjetQuery,
};

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
} from './lister/listerHistoriqueProjet.query';
export type {
  ListerHistoriqueReprésentantLégalProjetReadModel,
  HistoriqueReprésentantLégalProjetListItemReadModel,
} from './lister/listerHistoriqueReprésentantLégalProjet.query';
export type {
  ListerHistoriqueRaccordementProjetReadModel,
  HistoriqueRaccordementProjetListItemReadModel,
} from './lister/listerHistoriqueRaccordementProjet.query';

// register
export * from './register';
