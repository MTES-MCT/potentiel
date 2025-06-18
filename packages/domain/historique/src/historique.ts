import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueActionnaireProjetQuery } from './lister/listerHistoriqueActionnaireProjet.query';
import { ListerHistoriqueReprésentantLégalProjetQuery } from './lister/listerHistoriqueReprésentantLégalProjet.query';
import { ListerHistoriqueRaccordementProjetQuery } from './lister/listerHistoriqueRaccordementProjet.query';

// Query
export type HistoriqueQuery =
  | ListerHistoriqueProjetQuery
  | ListerHistoriqueActionnaireProjetQuery
  | ListerHistoriqueReprésentantLégalProjetQuery
  | ListerHistoriqueRaccordementProjetQuery;

export type {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueActionnaireProjetQuery,
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
  ListerHistoriqueActionnaireProjetReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
} from './lister/listerHistoriqueActionnaireProjet.query';
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
