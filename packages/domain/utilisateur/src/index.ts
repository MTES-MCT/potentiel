import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
  ConsulterUtilisateurReadModel,
} from './consulter/consulterUtilisateur.query';
import { ListerUtilisateursQuery, ListerUtilisateursPort } from './lister/listerUtilisateurs.query';
import {
  TrouverUtilisateurPort,
  TrouverUtilisateurQuery,
} from './trouver/trouverUtilisateur.query';
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
  | TrouverUtilisateurQuery
  | VérifierAccèsProjetQuery;

export {
  ConsulterUtilisateurQuery,
  ListerUtilisateursQuery,
  TrouverUtilisateurQuery,
  VérifierAccèsProjetQuery,
};

// Register
export * from './register';

// Port
export {
  ListerUtilisateursPort,
  RécupérerUtilisateurPort,
  VérifierAccèsProjetPort,
  TrouverUtilisateurPort,
};
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

// readmodel
export { ConsulterUtilisateurReadModel };
