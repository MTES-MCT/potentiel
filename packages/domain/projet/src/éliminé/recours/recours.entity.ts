import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { StatutRecours } from './index.js';

export type RecoursEntity = Entity<
  'recours',
  {
    identifiantProjet: string;
    dernièreDemande: { date: DateTime.RawType; statut: StatutRecours.RawType };
  }
>;
