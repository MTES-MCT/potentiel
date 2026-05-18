import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type AchèvementModifiéEvent = DomainEvent<
  'AchèvementModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateTransmissionAuCocontractant: DateTime.RawType;
    attestation?: { format: string };
    preuveTransmissionAuCocontractant?: { format: string };
    date: DateTime.RawType;
    utilisateur: Email.RawType;
  }
>;
