import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
} from './consulter/consulterUtilisateur.query';
import {
  ConsulterRégionDrealQuery,
  RécupérerRégionDrealPort,
} from './consulter/consulterRégionDreal.query';
import {
  VérifierAccèsProjetQuery,
  VérifierAccèsProjetPort,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';

export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';

// Query
export type UtilisateurQuery =
  | ConsulterUtilisateurQuery
  | VérifierAccèsProjetQuery
  | ConsulterRégionDrealQuery;

export { ConsulterUtilisateurQuery, VérifierAccèsProjetQuery, ConsulterRégionDrealQuery };

// Register
export * from './register';

// Port
export { RécupérerUtilisateurPort, VérifierAccèsProjetPort, RécupérerRégionDrealPort };

// Projection
export * from './utilisateur.projection';
