import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
  ConsulterUtilisateurReadModel,
} from './consulter/consulterUtilisateur.query';
import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
} from './lister/listerUtilisateurs.query';
import { TrouverUtilisateurQuery } from './trouver/trouverUtilisateur.query';
import { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.behavior';
import { UtilisateurInvitéEvent } from './inviter/inviterUtilisateur.behavior';
import { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase';
import { DésactiverUtilisateurUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.behavior';
import { RéactiverUtilisateurUseCase } from './réactiver/réactiverUtilisateur.usecase';
import { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.behavior';
export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';
export * as Région from './région.valueType';
export { UtilisateurInconnuError, AccèsFonctionnalitéRefuséError } from './errors';

// Query
export type UtilisateurQuery =
  | ConsulterUtilisateurQuery
  | ListerUtilisateursQuery
  | TrouverUtilisateurQuery;

export { ConsulterUtilisateurQuery, ListerUtilisateursQuery, TrouverUtilisateurQuery };

// UseCases
export type UtilisateurUseCase =
  | InviterUtilisateurUseCase
  | InviterPorteurUseCase
  | DésactiverUtilisateurUseCase
  | RéactiverUtilisateurUseCase;

export {
  InviterUtilisateurUseCase,
  InviterPorteurUseCase,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
};

// Events
export { UtilisateurEvent } from './utilisateur.aggregate';
export {
  PorteurInvitéEvent,
  UtilisateurInvitéEvent,
  UtilisateurDésactivéEvent,
  UtilisateurRéactivéEvent,
};
export * from './utilisateur.event';

// Register
export * from './register';

// Port
export { RécupérerUtilisateurPort };
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

// readmodel
export { ConsulterUtilisateurReadModel, ListerUtilisateursReadModel };
