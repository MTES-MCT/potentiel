import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * Représente la transmission de la date d'achèvement par le Cocontractant.
 * La transmission de la date peut également être faite avec par le Porteur via AttestationConformitéTransmise-V1.
 **/
export type DateAchèvementTransmiseEvent = DomainEvent<
  'DateAchèvementTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;

    dateAchèvement: DateTime.RawType;
    transmiseLe: DateTime.RawType;
    transmisePar: Email.RawType;
  }
>;
