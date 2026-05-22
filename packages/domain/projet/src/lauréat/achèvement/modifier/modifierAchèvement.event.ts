import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * @deprecated Cet événement ne contient pas la raison, désormais obligatoire
 */
export type AchèvementModifiéEventV1 = DomainEvent<
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

export type AchèvementModifiéEvent = DomainEvent<
  'AchèvementModifié-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateTransmissionAuCocontractant: DateTime.RawType;
    attestation?: { format: string };
    rapportAssocié?: { format: string };
    preuveTransmissionAuCocontractant?: { format: string };
    raison: string;
    date: DateTime.RawType;
    utilisateur: Email.RawType;
  }
>;
