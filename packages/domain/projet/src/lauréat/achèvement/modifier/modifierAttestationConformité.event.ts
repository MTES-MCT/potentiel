import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * @deprecated Cet événement ne contient pas le rapport associé, désormais obligatoire
 */
export type AttestationConformitéModifiéeEventV1 = DomainEvent<
  'AttestationConformitéModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

export type AttestationConformitéModifiéeEvent = DomainEvent<
  'AttestationConformitéModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    rapportAssocié: { format: string };
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;
