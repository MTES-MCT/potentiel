import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../..';
import { DispositifDeStockage } from '../../..';

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
