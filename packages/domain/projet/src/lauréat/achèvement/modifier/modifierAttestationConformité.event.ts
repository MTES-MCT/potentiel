import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type AttestationConformitéModifiéeEvent = DomainEvent<
  'AttestationConformitéModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    dateTransmissionAuCocontractant: DateTime.RawType;
    preuveTransmissionAuCocontractant?: { format: string };
    date: DateTime.RawType;
    utilisateur: Email.RawType;
  }
>;
