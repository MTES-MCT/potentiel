import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

export type PreuveRecandidatureTransmiseEvent = DomainEvent<
  'PreuveRecandidatureTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    preuveRecandidature: IdentifiantProjet.RawType;
    transmisePar: Email.RawType;
    transmiseLe: DateTime.RawType;
  }
>;
