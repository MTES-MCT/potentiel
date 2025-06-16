import { ListerHistoriqueProjetQuery } from './lister/listerHistoriqueProjet.query';
import { ListerHistoriqueRecoursProjetQuery } from './lister/listerHistoriqueRecoursProjet.query';
import { ListerHistoriqueActionnaireProjetQuery } from './lister/listerHistoriqueActionnaireProjet.query';
import { ListerHistoriquePuissanceProjetQuery } from './lister/listerHistoriquePuissanceProjet.query';
import { ListerHistoriqueReprésentantLégalProjetQuery } from './lister/listerHistoriqueReprésentantLégalProjet.query';
import { ListerHistoriqueRaccordementProjetQuery } from './lister/listerHistoriqueRaccordementProjet.query';

// Query
export type HistoriqueQuery =
  | ListerHistoriqueProjetQuery
  | ListerHistoriqueRecoursProjetQuery
  | ListerHistoriquePuissanceProjetQuery
  | ListerHistoriqueActionnaireProjetQuery
  | ListerHistoriqueReprésentantLégalProjetQuery
  | ListerHistoriqueRaccordementProjetQuery;

export type {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueRecoursProjetQuery,
  ListerHistoriqueActionnaireProjetQuery,
  ListerHistoriquePuissanceProjetQuery,
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
  ListerHistoriqueRecoursProjetReadModel,
  HistoriqueRecoursProjetListItemReadModel,
} from './lister/listerHistoriqueRecoursProjet.query';
export type {
  ListerHistoriqueActionnaireProjetReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
} from './lister/listerHistoriqueActionnaireProjet.query';
export type {
  ListerHistoriquePuissanceProjetReadModel,
  HistoriquePuissanceProjetListItemReadModel,
} from './lister/listerHistoriquePuissanceProjet.query';
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
