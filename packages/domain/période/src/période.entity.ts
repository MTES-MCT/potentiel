import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type * as IdentifiantPériode from './identifiantPériode.valueType.js';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: IdentifiantPériode.RawType;
    appelOffre: string;
    période: string;
    estNotifiée: boolean;

    notifiéeLe?: DateTime.RawType;
    notifiéePar?: Email.RawType;
  }
>;
