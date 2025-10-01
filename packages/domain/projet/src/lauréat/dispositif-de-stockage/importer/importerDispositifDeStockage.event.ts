import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
import { DispositifDeStockage } from '..';

export type DispositifDeStockageImportéEvent = DomainEvent<
  'DispositifDeStockageImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dispositifDeStockage: DispositifDeStockage.RawType;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;
