import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './lister/listerHistoriqueProjet.query';
import {
  ListerHistoriqueRecoursProjetDependencies,
  registerListerHistoriqueRecoursProjetQuery,
} from './lister/listerHistoriqueRecoursProjet.query';

export type HistoriqueQueryDependencies = ListerHistoriqueProjetDependencies &
  ListerHistoriqueRecoursProjetDependencies;

export const registerHistoriqueProjetQuery = (dependencies: HistoriqueQueryDependencies) => {
  registerListerHistoriqueRecoursProjetQuery(dependencies);
  registerListerHistoriqueProjetQuery(dependencies);
};
