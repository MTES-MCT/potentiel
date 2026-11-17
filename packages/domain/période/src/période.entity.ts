import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type * as IdentifiantPériode from './identifiantPériode.valueType.js';
import type { StatutPériode } from './période.js';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: IdentifiantPériode.RawType;
    appelOffre: string;
    période: string;
    statut: StatutPériode.RawType;

    notifiéeLe?: DateTime.RawType;
    notifiéePar?: Email.RawType;
  }
>;
