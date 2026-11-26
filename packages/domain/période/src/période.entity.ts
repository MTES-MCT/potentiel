import type { DateTime, Email } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type * as IdentifiantPériode from './identifiantPériode.valueType.js';
import type { StatutPériode } from './période.js';

export type PériodeEntity = Entity<
  'période',
  {
    identifiantPériode: IdentifiantPériode.RawType;
    appelOffre: string;
    période: string;
    statut: StatutPériode.RawType;

    importéeLe?: DateTime.RawType;
    importéePar?: Email.RawType;

    notifiéeLe?: DateTime.RawType;
    notifiéePar?: Email.RawType;

    projetsEnErreur: Array<{ identifiantProjet: IdentifiantProjet.RawType; motif: string }>;
  }
>;
