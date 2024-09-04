import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
} from './consulter/consulterUtilisateur.query';
import { ListerUtilisateurQuery, ListerUtilisateurPort } from './lister/listerUtilisateurs.query';
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
  | ListerUtilisateurQuery
  | VérifierAccèsProjetQuery;

export { ConsulterUtilisateurQuery, ListerUtilisateurQuery, VérifierAccèsProjetQuery };

// Register
export * from './register';

// Port
export { ListerUtilisateurPort, RécupérerUtilisateurPort, VérifierAccèsProjetPort };
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

export * from './permission.middleware';
