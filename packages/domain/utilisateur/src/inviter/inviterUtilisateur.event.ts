import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as Role from '../role.valueType';
import { Région, Zone } from '..';

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
    | {
        rôle:
          | 'porteur-projet'
          | 'ademe'
          | 'caisse-des-dépôts'
          | 'cre'
          /** @deprecated remplacé par Cocontractant dans la V2 */
          | 'acheteur-obligé';
      }
    | {
        rôle: 'dgec-validateur';
        fonction: string;
        nomComplet: string;
      }
    | {
        rôle: 'dreal';
        région: Région.RawType;
      }
    | {
        rôle: 'grd';
        identifiantGestionnaireRéseau: string;
      }
  )
>;

export type UtilisateurInvitéEvent = DomainEvent<
  'UtilisateurInvité-V2',
  {
    identifiantUtilisateur: Email.RawType;
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  } & (
    | {
        rôle: Exclude<
          Role.RawType,
          'porteur-projet' | 'dreal' | 'cocontractant' | 'grd' | 'dgec-validateur'
        >;
      }
    | {
        rôle: 'dgec-validateur';
        fonction: string;
        nomComplet: string;
      }
    | {
        rôle: 'dreal';
        région: Région.RawType;
      }
    | {
        rôle: 'grd';
        identifiantGestionnaireRéseau: string;
      }
    | {
        rôle: 'cocontractant';
        zone: Zone.RawType;
      }
  )
>;
