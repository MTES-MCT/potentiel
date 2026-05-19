import type {
  ConsulterUtilisateurQuery,
  ConsulterUtilisateurReadModel,
  RécupérerUtilisateurPort,
} from './consulter/consulterUtilisateur.query.js';
import type { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event.js';
import type { DésactiverUtilisateurUseCase } from './désactiver/désactiverUtilisateur.usecase.js';
import type { PorteurInvitéEvent } from './inviter/inviterPorteur.event.js';
import type { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase.js';
import type {
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
} from './inviter/inviterUtilisateur.event.js';
import type { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase.js';
import type {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
} from './lister/listerUtilisateurs.query.js';
import type { RôleUtilisateurModifiéEvent } from './modifierRôle/modifierRôleUtilisateur.event.js';
import type { ModifierRôleUtilisateurUseCase } from './modifierRôle/modifierRôleUtilisateur.usecase.js';
import type { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.event.js';
import type { RéactiverUtilisateurUseCase } from './réactiver/réactiverUtilisateur.usecase.js';
import type {
  TrouverUtilisateurQuery,
  TrouverUtilisateurReadModel,
} from './trouver/trouverUtilisateur.query.js';

export * as Role from './role.valueType.js';
export * as Région from './région.valueType.js';
export { AccèsFonctionnalitéRefuséError } from './utilisateur.error.js';
export * as Utilisateur from './utilisateur.valueType.js';
export * as Zone from './zone.valueType.js';

// Query
export type UtilisateurQuery =
  | ConsulterUtilisateurQuery
  | ListerUtilisateursQuery
  | TrouverUtilisateurQuery;

export type { ConsulterUtilisateurQuery, ListerUtilisateursQuery, TrouverUtilisateurQuery };

// UseCases
export type UtilisateurUseCase =
  | InviterUtilisateurUseCase
  | InviterPorteurUseCase
  | DésactiverUtilisateurUseCase
  | RéactiverUtilisateurUseCase
  | ModifierRôleUtilisateurUseCase;

// Register
export * from './register.js';
export * as UtilisateurSaga from './saga/utilisateur.saga.js';
// Entity
export type * from './utilisateur.entity.js';
export type * from './utilisateur.event.js';
// Events
export type { UtilisateurEvent } from './utilisateur.event.js';
// Port
// readmodel
export type {
  ConsulterUtilisateurReadModel,
  DésactiverUtilisateurUseCase,
  InviterPorteurUseCase,
  InviterUtilisateurUseCase,
  ListerUtilisateursReadModel,
  ModifierRôleUtilisateurUseCase,
  PorteurInvitéEvent,
  RéactiverUtilisateurUseCase,
  RécupérerUtilisateurPort,
  RôleUtilisateurModifiéEvent,
  TrouverUtilisateurReadModel,
  UtilisateurDésactivéEvent,
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
  UtilisateurRéactivéEvent,
};
