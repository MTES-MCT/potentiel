import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
} from './consulter/consulterUtilisateur.query';
import {
  VérifierAccèsProjetQuery,
  VérifierAccèsProjetPort,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';

export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';

// Query
export type UtilisateurQuery = ConsulterUtilisateurQuery | VérifierAccèsProjetQuery;

export { ConsulterUtilisateurQuery, VérifierAccèsProjetQuery };

// Register
export * from './register';

// Port
export { RécupérerUtilisateurPort, VérifierAccèsProjetPort };

// Projection
export * from './utilisateur.entity';
