import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
  ConsulterUtilisateurReadModel,
} from './consulter/consulterUtilisateur.query';
import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
} from './lister/listerUtilisateurs.query';
import {
  TrouverUtilisateurQuery,
  TrouverUtilisateurReadModel,
} from './trouver/trouverUtilisateur.query';
import { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.event';
import {
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
} from './inviter/inviterUtilisateur.event';
import { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase';
import { CréerPorteurUseCase } from './créer/créerPorteur.usecase';
import { DésactiverUtilisateurUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event';
import { RéactiverUtilisateurUseCase } from './réactiver/réactiverUtilisateur.usecase';
import { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.event';
import { ModifierRôleUtilisateurUseCase } from './modifierRôle/modifierRôleUtilisateur.usecase';
import { RoleUtilisateurModifiéEvent } from './modifierRôle/modifierRôleUtilisateur.event';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';
export * as Région from './région.valueType';
export * as Zone from './zone.valueType';
export { AccèsFonctionnalitéRefuséError } from './utilisateur.error';

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
  | ModifierRôleUtilisateurUseCase
  | CréerPorteurUseCase;

export {
  InviterUtilisateurUseCase,
  InviterPorteurUseCase,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
  ModifierRôleUtilisateurUseCase,
  CréerPorteurUseCase,
};

// Events
export { UtilisateurEvent } from './utilisateur.event';
export {
  PorteurInvitéEvent,
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
  UtilisateurDésactivéEvent,
  UtilisateurRéactivéEvent,
  RoleUtilisateurModifiéEvent,
};
export * from './utilisateur.event';

// Register
export * from './register';

// Port
export { RécupérerUtilisateurPort };

// Entity
export * from './utilisateur.entity';

// readmodel
export { ConsulterUtilisateurReadModel, ListerUtilisateursReadModel, TrouverUtilisateurReadModel };
