import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { DispositifDeStockage } from '../..';

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
