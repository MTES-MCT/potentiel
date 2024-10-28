import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
  ConsulterUtilisateurReadModel,
} from './consulter/consulterUtilisateur.query';
import { ListerUtilisateursQuery, ListerUtilisateursPort } from './lister/listerUtilisateurs.query';
import {
  VérifierAccèsProjetQuery,
  VérifierAccèsProjetPort,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';

export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';
export * as Groupe from './groupe.valueType';
export { AccèsFonctionnalitéRefuséError } from './errors';

// Query
export type UtilisateurQuery =
  | ConsulterUtilisateurQuery
  | ListerUtilisateursQuery
  | VérifierAccèsProjetQuery;

export { ConsulterUtilisateurQuery, ListerUtilisateursQuery, VérifierAccèsProjetQuery };

// Register
export * from './register';

// Port
export { ListerUtilisateursPort, RécupérerUtilisateurPort, VérifierAccèsProjetPort };
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

export * from './permission.middleware';

// readmodel
export { ConsulterUtilisateurReadModel };
