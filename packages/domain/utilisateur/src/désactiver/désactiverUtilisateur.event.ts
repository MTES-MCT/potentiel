import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type UtilisateurDésactivéEvent = DomainEvent<
  'UtilisateurDésactivé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    désactivéLe: DateTime.RawType;
    désactivéPar: Email.RawType;
  }
>;
