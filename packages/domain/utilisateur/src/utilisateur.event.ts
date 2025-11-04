import { Email, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { PorteurInvitéEvent } from './inviter/inviterPorteur.event';
import {
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
} from './inviter/inviterUtilisateur.event';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event';
import { UtilisateurRéactivéEvent } from './réactiver/réactiverUtilisateur.event';
import { RôleUtilisateurModifiéEvent } from './modifierRôle/modifierRôleUtilisateur.event';

/**
 * @deprecated La gestion des accès des projets est dorénavant dans le package projet.
 * Cet événement est remplacé par packages/domain/projet/src/accès/retirer/retirerAccèsProjet.event.ts
 */
export type AccèsProjetRetiréEvent = DomainEvent<
  'AccèsProjetRetiré-V1',
  {
    identifiantProjet: string;
    identifiantUtilisateur: Email.RawType;
    retiréLe: DateTime.RawType;
    retiréPar: Email.RawType;
    cause?: 'changement-producteur';
  }
>;

/**
 * @deprecated La gestion des accès des projets est dorénavant dans le package projet.
 * Cet événement est remplacé par packages/domain/projet/src/accès/autoriser/autoriserAccèsProjet.event.ts
 */
export type ProjetRéclaméEvent = DomainEvent<
  'ProjetRéclamé-V1',
  {
    identifiantProjet: string;
    identifiantUtilisateur: Email.RawType;
    réclaméLe: DateTime.RawType;
  }
>;

export type UtilisateurEvent =
  | PorteurInvitéEvent
  | UtilisateurInvitéEvent
  | UtilisateurInvitéEventV1
  | UtilisateurDésactivéEvent
  | UtilisateurRéactivéEvent
  | RôleUtilisateurModifiéEvent
  | AccèsProjetRetiréEvent
  | ProjetRéclaméEvent;
