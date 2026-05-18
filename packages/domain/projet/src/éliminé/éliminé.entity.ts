import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { IdentifiantProjet } from '../index.js';

export type ÉliminéEntity = Entity<
  'éliminé',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;
  }
>;
