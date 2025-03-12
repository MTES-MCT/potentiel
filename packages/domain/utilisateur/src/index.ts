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
import { PorteurInvitéEvent } from './inviter/inviterPorteur.behavior';
import { UtilisateurInvitéEvent } from './inviter/inviter.behavior';
import { InviterUtilisateurUseCase } from './inviter/inviter.usecase';
import { ProjetRéclaméEvent } from './réclamer/réclamerProjet.behavior';
import { RéclamerProjetUseCase } from './réclamer/réclamerProjet.usecase';
import { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.behavior';
import { RetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import {
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
} from './lister/listerProjetsÀRéclamer.query';

export * as IdentifiantUtilisateur from './identifiantUtilisateur.valueType';
export * as Utilisateur from './utilisateur.valueType';
export * as Role from './role.valueType';
export { AccèsFonctionnalitéRefuséError } from './errors';

// Query
export type UtilisateurQuery =
  | ConsulterUtilisateurQuery
  | ListerUtilisateursQuery
  | TrouverUtilisateurQuery
  | VérifierAccèsProjetQuery
  | ListerProjetsÀRéclamerQuery;

export {
  ConsulterUtilisateurQuery,
  ListerUtilisateursQuery,
  TrouverUtilisateurQuery,
  VérifierAccèsProjetQuery,
  ListerProjetsÀRéclamerQuery,
};

// UseCases
export type UtilisateurUseCase =
  | InviterUtilisateurUseCase
  | InviterPorteurUseCase
  | RéclamerProjetUseCase
  | RetirerAccèsProjetUseCase;

export {
  InviterUtilisateurUseCase,
  InviterPorteurUseCase,
  RéclamerProjetUseCase,
  RetirerAccèsProjetUseCase,
};

// Events
export { UtilisateurEvent } from './utilisateur.aggregate';
export { PorteurInvitéEvent, UtilisateurInvitéEvent, ProjetRéclaméEvent, AccèsProjetRetiréEvent };

// Register
export * from './register';

// Port
export { ListerUtilisateursPort, RécupérerUtilisateurPort, VérifierAccèsProjetPort };
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

// readmodel
export {
  ConsulterUtilisateurReadModel,
  ListerUtilisateursReadModel,
  ListerProjetsÀRéclamerReadModel,
};
