import {
  ListerHistoriqueAbandonProjetDependencies,
  registerListerHistoriqueAbandonProjetQuery,
} from './lister/listerHistoriqueAbandonProjet.query';
import {
  ListerHistoriqueActionnaireProjetDependencies,
  registerListerHistoriqueActionnaireProjetQuery,
} from './lister/listerHistoriqueActionnaireProjet.query';
import {
  ListerHistoriqueProducteurProjetDependencies,
  registerListerHistoriqueProducteurProjetQuery,
} from './lister/listerHistoriqueProducteurProjet.query';
import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './lister/listerHistoriqueProjet.query';
import {
  ListerHistoriquePuissanceProjetDependencies,
  registerListerHistoriquePuissanceProjetQuery,
} from './lister/listerHistoriquePuissanceProjet.query';
import {
  ListerHistoriqueRecoursProjetDependencies,
  registerListerHistoriqueRecoursProjetQuery,
} from './lister/listerHistoriqueRecoursProjet.query';

export type HistoriqueQueryDependencies = ListerHistoriqueProjetDependencies &
  ListerHistoriqueRecoursProjetDependencies &
  ListerHistoriqueAbandonProjetDependencies &
  ListerHistoriqueProducteurProjetDependencies &
  ListerHistoriquePuissanceProjetDependencies &
  ListerHistoriqueActionnaireProjetDependencies;

export const registerHistoriqueProjetQuery = (dependencies: HistoriqueQueryDependencies) => {
  registerListerHistoriqueAbandonProjetQuery(dependencies);
  registerListerHistoriqueActionnaireProjetQuery(dependencies);
  registerListerHistoriqueProducteurProjetQuery(dependencies);
  registerListerHistoriquePuissanceProjetQuery(dependencies);

  registerListerHistoriqueRecoursProjetQuery(dependencies);

  registerListerHistoriqueProjetQuery(dependencies);
};
