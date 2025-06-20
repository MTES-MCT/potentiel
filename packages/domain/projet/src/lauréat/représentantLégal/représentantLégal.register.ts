import {
  ListerHistoriqueReprésentantLégalProjetDependencies,
  registerListerHistoriqueReprésentantLégalProjetQuery,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query';

export type ReprésentantLégalQueryDependencies =
  ListerHistoriqueReprésentantLégalProjetDependencies;

export const registerReprésentantLégalQueries = (
  dependencies: ReprésentantLégalQueryDependencies,
) => {
  registerListerHistoriqueReprésentantLégalProjetQuery(dependencies);
};
