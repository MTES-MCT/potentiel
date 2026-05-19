import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../../index.js';
import type { DispositifDeStockage } from '../../../index.js';

export type ChangementDispositifDeStockageEnregistréEvent = DomainEvent<
  'ChangementDispositifDeStockageEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dispositifDeStockage: DispositifDeStockage.RawType;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;
