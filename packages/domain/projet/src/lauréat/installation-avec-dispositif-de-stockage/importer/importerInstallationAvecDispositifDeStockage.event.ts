import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
import { DispositifDeStockage } from '..';

export type InstallationAvecDispositifDeStockageImportéeEvent = DomainEvent<
  'InstallationAvecDispositifDeStockageImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    // installationAvecDispositifDeStockage: boolean;
    dispositifDeStockage: DispositifDeStockage.RawType;
    importéeLe: DateTime.RawType;
    importéePar: Email.RawType;
  }
>;
