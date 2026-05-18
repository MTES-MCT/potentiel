import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { StatutAbandon } from './index.js';

export type AbandonEntity = Entity<
  'abandon',
  {
    identifiantProjet: string;
    estAbandonné: boolean;
    dernièreDemande: { date: DateTime.RawType; statut: StatutAbandon.RawType };
  }
>;
