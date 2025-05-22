import { IdentifiantProjet, Email, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

/**
 * @deprecated La gestion des accès des projets est dorénavant dans le package projet.
 * Cet événement est remplacé par packages/domain/projet/src/accès/retirer/retirerAccèsProjet.event.ts
 */
export type AccèsProjetRetiréEvent = DomainEvent<
  'AccèsProjetRetiré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
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
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantUtilisateur: Email.RawType;
    réclaméLe: DateTime.RawType;
  }
>;
