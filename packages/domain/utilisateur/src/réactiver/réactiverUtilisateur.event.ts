import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type UtilisateurRéactivéEvent = DomainEvent<
  'UtilisateurRéactivé-V1',
  {
    identifiantUtilisateur: Email.RawType;
    réactivéLe: DateTime.RawType;
    réactivéPar: Email.RawType;
  }
>;
