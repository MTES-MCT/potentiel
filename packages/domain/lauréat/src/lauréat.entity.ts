import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    attestation: {
      format: string;
    };
  }
>;
