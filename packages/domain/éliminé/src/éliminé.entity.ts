import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ÉliminéEntity = Entity<
  'éliminé',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
  }
>;
