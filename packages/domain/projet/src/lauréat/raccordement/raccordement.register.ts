import {
  ListerHistoriqueRaccordementProjetDependencies,
  registerListerHistoriqueRaccordementProjetQuery,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query';

export type RaccordementQueryDependencies = ListerHistoriqueRaccordementProjetDependencies;

export const registerRaccordementQueries = (dependencies: RaccordementQueryDependencies) => {
  registerListerHistoriqueRaccordementProjetQuery(dependencies);
};
