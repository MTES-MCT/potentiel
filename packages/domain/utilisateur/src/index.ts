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
import {
  VérifierAccèsProjetQuery,
  VérifierAccèsProjetPort,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';
import { InviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.behavior';
import { UtilisateurInvitéEvent } from './inviter/inviterUtilisateur.behavior';
import { InviterUtilisateurUseCase } from './inviter/inviterUtilisateur.usecase';
import { AccèsProjetRetiréEvent } from './retirer/retirerAccèsProjet.behavior';
import { RetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import {
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
} from './lister/listerProjetsÀRéclamer.query';
import { ListerPorteursQuery, ListerPorteursReadModel } from './lister/listerPorteurs.query';
import { RetirerAccèsProjetCommand } from './retirer/retirerAccèsProjet.command';
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
  | TrouverUtilisateurQuery
  | VérifierAccèsProjetQuery
  | ListerProjetsÀRéclamerQuery
  | ListerPorteursQuery;

export {
  ConsulterUtilisateurQuery,
  ListerUtilisateursQuery,
  TrouverUtilisateurQuery,
  VérifierAccèsProjetQuery,
  ListerProjetsÀRéclamerQuery,
  ListerPorteursQuery,
};

// UseCases
export type UtilisateurUseCase =
  | InviterUtilisateurUseCase
  | InviterPorteurUseCase
  | RetirerAccèsProjetUseCase
  | DésactiverUtilisateurUseCase
  | RéactiverUtilisateurUseCase;

export {
  InviterUtilisateurUseCase,
  InviterPorteurUseCase,
  RetirerAccèsProjetUseCase,
  DésactiverUtilisateurUseCase,
  RéactiverUtilisateurUseCase,
};

// Command
export { RetirerAccèsProjetCommand };

// Events
export { UtilisateurEvent } from './utilisateur.aggregate';
export {
  PorteurInvitéEvent,
  UtilisateurInvitéEvent,
  AccèsProjetRetiréEvent,
  UtilisateurDésactivéEvent,
  UtilisateurRéactivéEvent,
};

// Register
export * from './register';

// Port
export { RécupérerUtilisateurPort, VérifierAccèsProjetPort };
export * from './utilisateur.port';

// Entity
export * from './utilisateur.entity';

// readmodel
export {
  ConsulterUtilisateurReadModel,
  ListerUtilisateursReadModel,
  ListerProjetsÀRéclamerReadModel,
  ListerPorteursReadModel,
};
