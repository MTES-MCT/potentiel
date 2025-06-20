import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';

// Query
export type HistoriqueQuery = ListerHistoriqueProjetQuery;

export type { ListerHistoriqueProjetQuery };

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
} from './lister/listerHistoriqueProjet.query';

// register
export * from './register';
