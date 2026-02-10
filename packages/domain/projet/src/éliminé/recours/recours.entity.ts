import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { StatutRecours } from './index.js';

export type RecoursEntity = Entity<
  'recours',
  {
    identifiantProjet: string;
    dernièreDemande: { date: DateTime.RawType; statut: StatutRecours.RawType };
  }
>;
