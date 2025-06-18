import {
  ListerHistoriqueActionnaireProjetDependencies,
  registerListerHistoriqueActionnaireProjetQuery,
} from './lister/listerHistoriqueActionnaireProjet.query';
import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './lister/listerHistoriqueProjet.query';
import {
  ListerHistoriqueRaccordementProjetDependencies,
  registerListerHistoriqueRaccordementProjetQuery,
} from './lister/listerHistoriqueRaccordementProjet.query';
import {
  ListerHistoriqueReprésentantLégalProjetDependencies,
  registerListerHistoriqueReprésentantLégalProjetQuery,
} from './lister/listerHistoriqueReprésentantLégalProjet.query';

export type HistoriqueQueryDependencies = ListerHistoriqueProjetDependencies &
  ListerHistoriqueActionnaireProjetDependencies &
  ListerHistoriqueReprésentantLégalProjetDependencies &
  ListerHistoriqueRaccordementProjetDependencies;

export const registerHistoriqueProjetQuery = (dependencies: HistoriqueQueryDependencies) => {
  registerListerHistoriqueActionnaireProjetQuery(dependencies);
  registerListerHistoriqueReprésentantLégalProjetQuery(dependencies);
  registerListerHistoriqueRaccordementProjetQuery(dependencies);

  registerListerHistoriqueProjetQuery(dependencies);
};
