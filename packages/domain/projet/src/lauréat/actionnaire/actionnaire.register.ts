import {
  ListerHistoriqueActionnaireProjetDependencies,
  registerListerHistoriqueActionnaireProjetQuery,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query';

export type ActionnaireQueryDependencies = ListerHistoriqueActionnaireProjetDependencies;

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerListerHistoriqueActionnaireProjetQuery(dependencies);
};
