import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { StatutChangementPuissance } from './index.js';

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
