import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { SpécificitésRoleEventPayload } from '../inviter/inviterUtilisateur.event';

export type RoleUtilisateurModifiéEvent = DomainEvent<
  'RoleUtilisateurModifié-V1',
  {
    identifiantUtilisateur: Email.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  } & SpécificitésRoleEventPayload
>;
