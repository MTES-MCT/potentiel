import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type AttestationConformitéEnregistréeEvent = DomainEvent<
  'AttestationConformitéEnregistrée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestationConformité: { format: string };
    enregistréeLe: DateTime.RawType;
    enregistréePar: Email.RawType;
  }
>;
