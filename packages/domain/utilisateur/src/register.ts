import {
  registerConsulterRégionDrealQuery,
  ConsulterRégionDrealDependencies,
} from './consulter/consulterRégionDreal.query';
import {
  ConsulterUtilisateurDependencies,
  registerConsulterUtilisateurQuery,
} from './consulter/consulterUtilisateur.query';
import {
  VérifierAccèsProjetDependencies,
  registerVérifierAccèsProjetQuery,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  VérifierAccèsProjetDependencies &
  ConsulterRégionDrealDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerVérifierAccèsProjetQuery(dependencies);
  registerConsulterRégionDrealQuery(dependencies);
};
