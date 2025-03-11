import {
  ConsulterUtilisateurQuery,
  RécupérerUtilisateurPort,
  ConsulterUtilisateurReadModel,
} from './consulter/consulterUtilisateur.query';
import {
  ListerUtilisateursQuery,
  ListerUtilisateursReadModel,
  ListerUtilisateursPort,
} from './lister/listerUtilisateurs.query';
import { TrouverUtilisateurQuery } from './trouver/trouverUtilisateur.query';
import {
  VérifierAccèsProjetQuery,
  VérifierAccèsProjetPort,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';
import { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import { AccèsAuProjetAutoriséEvent } from './inviter/inviterPorteur.behavior';
import { UtilisateurInvitéEvent } from './inviter/inviter.behavior';
import { InviterUtilisateurUseCase } from './inviter/inviter.usecase';
import { RéclamerProjetUseCase } from './réclamer/réclamer.usecase';
import { ProjetRéclaméEvent } from './réclamer/réclamer.behavior';

export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';
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

// UseCases
export type UtilisateurUseCase =
  | InviterUtilisateurUseCase
  | InviterPorteurUseCase
  | RéclamerProjetUseCase;

export { InviterUtilisateurUseCase, InviterPorteurUseCase, RéclamerProjetUseCase };

// Events
export { UtilisateurEvent } from './utilisateur.aggregate';
export { AccèsAuProjetAutoriséEvent, UtilisateurInvitéEvent, ProjetRéclaméEvent };

// Register
export * from './register';

// Port
export { ListerUtilisateursPort, RécupérerUtilisateurPort, VérifierAccèsProjetPort };
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

// readmodel
export { ConsulterUtilisateurReadModel, ListerUtilisateursReadModel };
