import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { StatutAbandon } from '.';

export type AbandonEntity = Entity<
  'abandon',
  {
    identifiantProjet: string;
    estAbandonné: boolean;
    dernièreDemande: { date: DateTime.RawType; statut: StatutAbandon.RawType };
  }
>;
