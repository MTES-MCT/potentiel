import {
  ConsulterUtilisateurQuery,
  ConsulterUtilisateurReadModel,
  RécupérerUtilisateurPort,
} from './consulter/consulterUtilisateur.query';
import { CréerPorteurUseCase } from './créer/créerPorteur.usecase';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.behavior';
import { DésactiverUtilisateurUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.behavior';
import { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import { UtilisateurInvitéEvent } from './inviter/inviterUtilisateur.behavior';
import { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase';
import { ListerPorteursQuery, ListerPorteursReadModel } from './lister/listerPorteurs.query';
import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
} from './lister/listerUtilisateurs.query';
import { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.behavior';
import { RéactiverUtilisateurUseCase } from './réactiver/réactiverUtilisateur.usecase';
import { TrouverUtilisateurQuery } from './trouver/trouverUtilisateur.query';

export { AccèsFonctionnalitéRefuséError, UtilisateurInconnuError } from './errors';
export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Role from './role.valueType';
export * as Région from './région.valueType';
export * as Utilisateur from './utilisateur.valueType';

// Query
export type UtilisateurQuery =
  | ConsulterUtilisateurQuery
  | ListerUtilisateursQuery
  | ListerPorteursQuery
  | TrouverUtilisateurQuery;

export {
  ConsulterUtilisateurQuery,
  ListerUtilisateursQuery,
  TrouverUtilisateurQuery,
  ListerPorteursQuery,
};

// UseCases
export type UtilisateurUseCase =
  | InviterUtilisateurUseCase
  | InviterPorteurUseCase
  | DésactiverUtilisateurUseCase
  | RéactiverUtilisateurUseCase
  | CréerPorteurUseCase;

export {
  InviterUtilisateurUseCase,
  InviterPorteurUseCase,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
  CréerPorteurUseCase,
};

// Events
export { UtilisateurEvent } from './utilisateur.aggregate';
export {
  PorteurInvitéEvent,
  UtilisateurInvitéEvent,
  UtilisateurDésactivéEvent,
  UtilisateurRéactivéEvent,
};

// Register
export * from './register';
export * from './utilisateur.event';

// Port
export { RécupérerUtilisateurPort };

// Entity
export * from './utilisateur.entity';
export * from './utilisateur.port';

// readmodel
export { ConsulterUtilisateurReadModel, ListerUtilisateursReadModel, ListerPorteursReadModel };
