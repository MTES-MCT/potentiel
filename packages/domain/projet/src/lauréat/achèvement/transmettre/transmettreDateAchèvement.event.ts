import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

/**
 * Représente la transmission de la date d'achèvement par le cocontractant.
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
