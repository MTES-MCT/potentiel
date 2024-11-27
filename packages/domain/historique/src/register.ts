import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './lister/listerHistoriqueProjet.query';

export type HistoriqueQueryDependencies = ListerHistoriqueProjetDependencies;

export const registerHistoriqueProjetQuery = (dependencies: HistoriqueQueryDependencies) => {
  registerListerHistoriqueProjetQuery(dependencies);
};
