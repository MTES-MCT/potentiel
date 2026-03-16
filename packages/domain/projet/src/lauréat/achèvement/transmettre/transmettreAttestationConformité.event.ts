import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

/**
 * Représente la transmission de la date d'achèvement de l'attestation de conformité par le Porteur
 **/
export type AttestationConformitéTransmiseEvent = DomainEvent<
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
