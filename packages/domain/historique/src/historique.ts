import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueRecoursProjetQuery } from './lister/listerHistoriqueRecoursProjet.query';
import { ListerHistoriqueAbandonProjetQuery } from './lister/listerHistoriqueAbandonProjet.query';
import { ListerHistoriqueActionnaireProjetQuery } from './lister/listerHistoriqueActionnaireProjet.query';
import { ListerHistoriqueProducteurProjetQuery } from './lister/listerHistoriqueProducteurProjet.query';
import { ListerHistoriquePuissanceProjetQuery } from './lister/listerHistoriquePuissanceProjet.query';
import { ListerHistoriqueReprésentantLégalProjetQuery } from './lister/listerHistoriqueReprésentantLégalProjet.query';

// Query
export type HistoriqueQuery =
  | ListerHistoriqueProjetQuery
  | ListerHistoriqueRecoursProjetQuery
  | ListerHistoriqueAbandonProjetQuery
  | ListerHistoriqueProducteurProjetQuery
  | ListerHistoriquePuissanceProjetQuery
  | ListerHistoriqueActionnaireProjetQuery
  | ListerHistoriqueReprésentantLégalProjetQuery;
export type {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueRecoursProjetQuery,
  ListerHistoriqueAbandonProjetQuery,
  ListerHistoriqueActionnaireProjetQuery,
  ListerHistoriqueProducteurProjetQuery,
  ListerHistoriquePuissanceProjetQuery,
  ListerHistoriqueReprésentantLégalProjetQuery,
};

// Read Models
export type {
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
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
  ListerHistoriqueActionnaireProjetReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
} from './lister/listerHistoriqueActionnaireProjet.query';
export type {
  ListerHistoriqueProducteurProjetReadModel,
  HistoriqueProducteurProjetListItemReadModel,
} from './lister/listerHistoriqueProducteurProjet.query';
export type {
  ListerHistoriquePuissanceProjetReadModel,
  HistoriquePuissanceProjetListItemReadModel,
} from './lister/listerHistoriquePuissanceProjet.query';
export type {
  ListerHistoriqueReprésentantLégalProjetReadModel,
  HistoriqueReprésentantLégalProjetListItemReadModel,
} from './lister/listerHistoriqueReprésentantLégalProjet.query';

// register
export * from './register';
