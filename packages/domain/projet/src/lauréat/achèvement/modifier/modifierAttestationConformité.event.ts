import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type AttestationConformitéModifiéeEvent = DomainEvent<
  'AttestationConformitéModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;
