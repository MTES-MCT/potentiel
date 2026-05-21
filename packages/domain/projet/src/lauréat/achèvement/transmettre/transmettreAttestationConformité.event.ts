import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

/**
 * @deprecated Cet événement ne contient pas le rapport associé, désormais obligatoire
 */
export type AttestationConformitéTransmiseEventV1 = DomainEvent<
  'AttestationConformitéTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    // La date de transmission au Cocontractant vaut date d'achèvement du projet
    dateTransmissionAuCocontractant: DateTime.RawType;
    preuveTransmissionAuCocontractant: { format: string };
    date: DateTime.RawType;
    utilisateur: Email.RawType;
  }
>;
/**
 * Représente la transmission de la date d'achèvement de l'attestation de conformité par le Porteur
 **/
export type AttestationConformitéTransmiseEvent = DomainEvent<
  'AttestationConformitéTransmise-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    date: DateTime.RawType;
    dateTransmissionAuCocontractant: DateTime.RawType;
    utilisateur: Email.RawType;
    attestation: { format: string };
    rapportAssocié: { format: string };
    // La date de transmission au Cocontractant vaut date d'achèvement du projet
    preuveTransmissionAuCocontractant: { format: string };
  }
>;
