import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { DispositifDeStockage } from '.';

export type DispositifDeStockageEntity = Entity<
  'dispositif-de-stockage',
  {
    identifiantProjet: string;
    dispositifDeStockage: DispositifDeStockage.RawType;
    miseÀJourLe: DateTime.RawType;
  }
>;
