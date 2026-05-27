import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * @deprecated Cet événement ne contient pas le rapport associé, désormais obligatoire
 */
export type AttestationConformitéEnregistréeEventV1 = DomainEvent<
  'AttestationConformitéEnregistrée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestationConformité: { format: string };
    enregistréeLe: DateTime.RawType;
    enregistréePar: Email.RawType;
  }
>;

export type AttestationConformitéEnregistréeEvent = DomainEvent<
  'AttestationConformitéEnregistrée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestationConformité: { format: string };
    rapportAssocié: { format: string };
    enregistréeLe: DateTime.RawType;
    enregistréePar: Email.RawType;
  }
>;
