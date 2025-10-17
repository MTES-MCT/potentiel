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
import { PorteurInvitéEvent } from './inviter/inviterPorteur.event';
import { UtilisateurInvitéEvent } from './inviter/inviterUtilisateur.event';
import { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase';
import { CréerPorteurUseCase } from './créer/créerPorteur.usecase';
import { DésactiverUtilisateurUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event';
import { RéactiverUtilisateurUseCase } from './réactiver/réactiverUtilisateur.usecase';
import { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.event';
import { ListerPorteursQuery, ListerPorteursReadModel } from './lister/listerPorteurs.query';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';
export * as Région from './région.valueType';
export { AccèsFonctionnalitéRefuséError } from './utilisateur.error';

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
export { UtilisateurEvent } from './utilisateur.event';
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

// Entity
export * from './utilisateur.entity';

// readmodel
export { ConsulterUtilisateurReadModel, ListerUtilisateursReadModel, ListerPorteursReadModel };
