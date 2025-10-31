import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import {
  RôleDgecValidateurPayload,
  RôleDrealPayload,
  RôleGlobalPayload,
  RôleGrdPayload,
  SpécificitésRolePayload,
} from '../utilisateur.valueType';

/** @deprecated remplacé par Cocontractant dans la V2 */
type RôleAcheteurObligéPayload = {
  rôle: 'acheteur-obligé';
};

/**
 * @deprecated Cette version de l'évènement gérait un rôle "acheteur-obligé" qui a été remplacé par "cocontractant" dans la V2
 */
export type UtilisateurInvitéEventV1 = DomainEvent<
  'UtilisateurInvité-V1',
  {
    identifiantUtilisateur: Email.RawType;
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  } & (
    | RôleGlobalPayload
    | RôleDgecValidateurPayload
    | RôleDrealPayload
    | RôleGrdPayload
    | RôleAcheteurObligéPayload
  )
>;

export type UtilisateurInvitéEvent = DomainEvent<
  'UtilisateurInvité-V2',
  {
    identifiantUtilisateur: Email.RawType;
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  } & SpécificitésRolePayload
>;
