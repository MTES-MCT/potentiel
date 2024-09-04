import {
  ConsulterUtilisateurDependencies,
  registerConsulterUtilisateurQuery,
} from './consulter/consulterUtilisateur.query';
import {
  ListerUtilisateurDependencies,
  registerListerUtilisateursQuery,
} from './lister/listerUtilisateurs.query';
import {
  VérifierAccèsProjetDependencies,
  registerVérifierAccèsProjetQuery,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  ListerUtilisateurDependencies &
  VérifierAccèsProjetDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerListerUtilisateursQuery(dependencies);
  registerVérifierAccèsProjetQuery(dependencies);
};
