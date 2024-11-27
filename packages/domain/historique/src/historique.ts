import {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueProjetReadModel,
} from './lister/listerHistoriqueProjet.query';

// Query
export type HistoriqueQuery = ListerHistoriqueProjetQuery;
export type { ListerHistoriqueProjetQuery };

// Read Models
export type { ListerHistoriqueProjetReadModel };

// register
export * from './register';
