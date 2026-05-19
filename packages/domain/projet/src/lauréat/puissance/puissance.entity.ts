import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { StatutChangementPuissance } from './index.js';

export type PuissanceEntity = Entity<
  'puissance',
  {
    identifiantProjet: string;
    puissance: number;
    puissanceDeSite?: number;
    miseÀJourLe: DateTime.RawType;
    dernièreDemande?: { date: DateTime.RawType; statut: StatutChangementPuissance.RawType };
  }
>;
