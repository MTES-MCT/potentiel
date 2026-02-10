import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

export type AttestationConformitéModifiéeEvent = DomainEvent<
  'AttestationConformitéModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateTransmissionAuCocontractant: DateTime.RawType;
    attestation?: { format: string };
    preuveTransmissionAuCocontractant?: { format: string };
    date: DateTime.RawType;
    utilisateur: Email.RawType;
  }
>;
