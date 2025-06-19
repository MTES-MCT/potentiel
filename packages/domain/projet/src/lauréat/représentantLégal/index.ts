import {
  ListerHistoriqueReprésentantLégalProjetQuery,
  ListerHistoriqueReprésentantLégalProjetReadModel,
  HistoriqueReprésentantLégalProjetListItemReadModel,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query';

// Query
export type ReprésentantLégalQuery = ListerHistoriqueReprésentantLégalProjetQuery;

export type { ListerHistoriqueReprésentantLégalProjetQuery };

// ReadModel
export type {
  ListerHistoriqueReprésentantLégalProjetReadModel,
  HistoriqueReprésentantLégalProjetListItemReadModel,
};

// Events
export * from './représentantLégal.event';

// Value types
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType';
