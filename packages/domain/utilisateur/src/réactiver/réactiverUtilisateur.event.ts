import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type UtilisateurRéactivéEvent = DomainEvent<
  'UtilisateurRéactivé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    réactivéLe: DateTime.RawType;
    réactivéPar: Email.RawType;
  }
>;
