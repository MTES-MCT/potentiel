import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { SpécificitésRolePayload } from '../utilisateur.valueType.js';

export type RôleUtilisateurModifiéEvent = DomainEvent<
  'RôleUtilisateurModifié-V1',
  {
    identifiantUtilisateur: Email.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  } & SpécificitésRolePayload
>;
