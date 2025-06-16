import {
  ListerHistoriqueActionnaireProjetDependencies,
  registerListerHistoriqueActionnaireProjetQuery,
} from './lister/listerHistoriqueActionnaireProjet.query';
import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './lister/listerHistoriqueProjet.query';
import {
  ListerHistoriquePuissanceProjetDependencies,
  registerListerHistoriquePuissanceProjetQuery,
} from './lister/listerHistoriquePuissanceProjet.query';
import {
  ListerHistoriqueRaccordementProjetDependencies,
  registerListerHistoriqueRaccordementProjetQuery,
} from './lister/listerHistoriqueRaccordementProjet.query';
import {
  ListerHistoriqueRecoursProjetDependencies,
  registerListerHistoriqueRecoursProjetQuery,
} from './lister/listerHistoriqueRecoursProjet.query';
import {
  ListerHistoriqueReprésentantLégalProjetDependencies,
  registerListerHistoriqueReprésentantLégalProjetQuery,
} from './lister/listerHistoriqueReprésentantLégalProjet.query';

export type HistoriqueQueryDependencies = ListerHistoriqueProjetDependencies &
  ListerHistoriqueRecoursProjetDependencies &
  ListerHistoriquePuissanceProjetDependencies &
  ListerHistoriqueActionnaireProjetDependencies &
  ListerHistoriqueReprésentantLégalProjetDependencies &
  ListerHistoriqueRaccordementProjetDependencies;

export const registerHistoriqueProjetQuery = (dependencies: HistoriqueQueryDependencies) => {
  registerListerHistoriqueActionnaireProjetQuery(dependencies);
  registerListerHistoriquePuissanceProjetQuery(dependencies);
  registerListerHistoriqueReprésentantLégalProjetQuery(dependencies);
  registerListerHistoriqueRaccordementProjetQuery(dependencies);

  registerListerHistoriqueRecoursProjetQuery(dependencies);

  registerListerHistoriqueProjetQuery(dependencies);
};
