import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueRaccordementProjetQuery } from './lister/listerHistoriqueRaccordementProjet.query';

// Query
export type HistoriqueQuery = ListerHistoriqueProjetQuery | ListerHistoriqueRaccordementProjetQuery;

export type { ListerHistoriqueProjetQuery, ListerHistoriqueRaccordementProjetQuery };

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
} from './lister/listerHistoriqueProjet.query';
export type {
  ListerHistoriqueRaccordementProjetReadModel,
  HistoriqueRaccordementProjetListItemReadModel,
} from './lister/listerHistoriqueRaccordementProjet.query';

// register
export * from './register';
