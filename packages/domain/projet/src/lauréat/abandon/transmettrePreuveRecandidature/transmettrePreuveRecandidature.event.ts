import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type PreuveRecandidatureTransmiseEvent = DomainEvent<
  'PreuveRecandidatureTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    preuveRecandidature: IdentifiantProjet.RawType;
    transmisePar: Email.RawType;
    transmiseLe: DateTime.RawType;
  }
>;
