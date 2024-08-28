import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/core';

export type ÉliminéEntity = Entity<
  'éliminé',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
    attestation: {
      format: string;
    };
  }
>;
