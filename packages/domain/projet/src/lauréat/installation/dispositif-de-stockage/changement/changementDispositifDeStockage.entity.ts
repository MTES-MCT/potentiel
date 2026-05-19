import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { DispositifDeStockage } from '../../index.js';

export type ChangementDispositifDeStockageEntity = Entity<
  'changement-dispositif-de-stockage',
  {
    identifiantProjet: string;

    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      dispositifDeStockage: DispositifDeStockage.RawType;
      raison: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;
