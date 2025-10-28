import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { Région, Zone } from '..';

type RôleGlobalEventPayload = {
  rôle: 'admin' | 'ademe' | 'caisse-des-dépôts' | 'cre';
};

type RôleDgecValidateurEventPayload = {
  rôle: 'dgec-validateur';
  fonction: string;
  nomComplet: string;
};

type RôleDrealEventPayload = {
  rôle: 'dreal';
  région: Région.RawType;
};

type RôleGrdEventPayload = {
  rôle: 'grd';
  identifiantGestionnaireRéseau: string;
};

type RôleCocontractantEventPayload = {
  rôle: 'cocontractant';
  zone: Zone.RawType;
};

/** @deprecated remplacé par Cocontractant dans la V2 */
type RôleAcheteurObligéEventPayload = {
  rôle: 'acheteur-obligé';
};

export type SpécificitésRoleEventPayload =
  | RôleGlobalEventPayload
  | RôleDgecValidateurEventPayload
  | RôleDrealEventPayload
  | RôleGrdEventPayload
  | RôleCocontractantEventPayload;

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
    | RôleGlobalEventPayload
    | RôleDgecValidateurEventPayload
    | RôleDrealEventPayload
    | RôleGrdEventPayload
    | RôleAcheteurObligéEventPayload
  )
>;

export type UtilisateurInvitéEvent = DomainEvent<
  'UtilisateurInvité-V2',
  {
    identifiantUtilisateur: Email.RawType;
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  } & SpécificitésRoleEventPayload
>;
