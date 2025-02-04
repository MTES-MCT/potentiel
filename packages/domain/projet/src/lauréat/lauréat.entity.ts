import { DateTime, Email } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '..';

export type LauréatEntity = Entity<
  'lauréat',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
  }
>;
