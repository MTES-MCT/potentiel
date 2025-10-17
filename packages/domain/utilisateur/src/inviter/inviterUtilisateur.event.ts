import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as Role from '../role.valueType';

export type UtilisateurInvitéEvent = DomainEvent<
  'UtilisateurInvité-V1',
  {
    identifiantUtilisateur: Email.RawType;
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  } & (
    | {
        rôle: Exclude<Role.RawType, 'porteur-projet' | 'dreal' | 'grd' | 'dgec-validateur'>;
      }
    | {
        rôle: 'dgec-validateur';
        fonction: string;
        nomComplet: string;
      }
    | {
        rôle: 'dreal';
        région: string;
      }
    | {
        rôle: 'grd';
        identifiantGestionnaireRéseau: string;
      }
  )
>;
