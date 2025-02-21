import {
  ConsulterUtilisateurDependencies,
  registerConsulterUtilisateurQuery,
} from './consulter/consulterUtilisateur.query';
import {
  ListerUtilisateursDependencies,
  registerListerUtilisateursQuery,
} from './lister/listerUtilisateurs.query';
import {
  registerTrouverUtilisateurQuery,
  TrouverUtilisateurDependencies,
} from './trouver/trouverUtilisateur.query';
import {
  VérifierAccèsProjetDependencies,
  registerVérifierAccèsProjetQuery,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  ListerUtilisateursDependencies &
  VérifierAccèsProjetDependencies &
  TrouverUtilisateurDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerListerUtilisateursQuery(dependencies);
  registerTrouverUtilisateurQuery(dependencies);
  registerVérifierAccèsProjetQuery(dependencies);
};
