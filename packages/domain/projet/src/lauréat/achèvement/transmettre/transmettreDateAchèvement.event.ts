import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

/**
 * Evènement temporaire, mis en place pour l'automatisation de la transmissiond de la date d'achèvement par le co-contractant, en attendant que le dépôt de l'attestation soit fait sur Potentiel.
 **/
export type DateAchèvementTransmiseEvent = DomainEvent<
  'DateAchèvementTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    /** document sans valeur, pour palier au manque temporaire d'attestation entre AttestationConformitéTransmise-V1 et AttestationConformitéTransmise-V2 */
    attestation: { format: string };
    dateAchèvement: DateTime.RawType;
    transmiseLe: DateTime.RawType;
    transmisePar: Email.RawType;
  }
>;
