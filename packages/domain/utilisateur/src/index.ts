import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
  ConsulterUtilisateurReadModel,
} from './consulter/consulterUtilisateur.query.js';
import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
} from './lister/listerUtilisateurs.query.js';
import {
  TrouverUtilisateurQuery,
  TrouverUtilisateurReadModel,
} from './trouver/trouverUtilisateur.query.js';
import { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase.js';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.event.js';
import {
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
} from './inviter/inviterUtilisateur.event.js';
import { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase.js';
import { DésactiverUtilisateurUseCase } from './désactiver/désactiverUtilisateur.usecase.js';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event.js';
import { RéactiverUtilisateurUseCase } from './réactiver/réactiverUtilisateur.usecase.js';
import { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.event.js';
import { ModifierRôleUtilisateurUseCase } from './modifierRôle/modifierRôleUtilisateur.usecase.js';
import { RôleUtilisateurModifiéEvent } from './modifierRôle/modifierRôleUtilisateur.event.js';
export * as Utilisateur from './utilisateur.valueType.js';
export * as Role from './role.valueType.js';
export * as Région from './région.valueType.js';
export * as Zone from './zone.valueType.js';
export { AccèsFonctionnalitéRefuséError } from './utilisateur.error.js';

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
  | RéactiverUtilisateurUseCase
  | ModifierRôleUtilisateurUseCase;

export {
  InviterUtilisateurUseCase,
  InviterPorteurUseCase,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
  ModifierRôleUtilisateurUseCase,
};

// Events
export { UtilisateurEvent } from './utilisateur.event.js';
export {
  PorteurInvitéEvent,
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
  UtilisateurDésactivéEvent,
  UtilisateurRéactivéEvent,
  RôleUtilisateurModifiéEvent,
};
export * from './utilisateur.event.js';

// Register
export * from './register.js';

// Port
export { RécupérerUtilisateurPort };

// Entity
export * from './utilisateur.entity.js';

// readmodel
export { ConsulterUtilisateurReadModel, ListerUtilisateursReadModel, TrouverUtilisateurReadModel };

export * as UtilisateurSaga from './saga/utilisateur.saga.js';
