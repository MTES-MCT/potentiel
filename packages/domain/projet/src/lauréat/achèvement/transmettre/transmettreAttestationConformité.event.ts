import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

/**
 * Représente la transmission de l'attestation de conformité par le Porteur, dans le cas où cette attestation a déjà été transmise au co-contractant
 **/
export type AttestationConformitéTransmiseEvent = DomainEvent<
  'AttestationConformitéTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    attestation: { format: string };
    // La date de transmission au co-contractant vaut date d'achèvement du projet
    dateTransmissionAuCocontractant: DateTime.RawType;
    preuveTransmissionAuCocontractant: { format: string };
    date: DateTime.RawType;
    utilisateur: Email.RawType;
  }
>;

// /**
//  * Représente la transmission de l'attestation de conformité par le Porteur, sans transmission préalable au co-contractant.
//  * La date de transmission vaut date d'achèvement du projet, une fois l'attestation validée par le co-contractant.
//  **/
// export type AttestationConformitéTransmiseV2Event = DomainEvent<
//   'AttestationConformitéTransmise-V2',
//   {
//     identifiantProjet: IdentifiantProjet.RawType;
//     attestation: { format: string };
//     transmisLe: DateTime.RawType;
//     transmisPar: Email.RawType;
//   }
// >;

// // Validation / rejet par le co-contractant. D'autres statuts pourraient exister, à confirmer.
// export type AttestationConformitéValidéeEvent = DomainEvent<
//   'AttestationConformitéValidée-V1',
//   {
//     identifiantProjet: IdentifiantProjet.RawType;
//     validéeLe: DateTime.RawType;
//     validéePar: Email.RawType;
//   }
// >;
