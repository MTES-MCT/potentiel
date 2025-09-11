import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type InstallationAvecDispositifDeStockageImportéEvent = DomainEvent<
  'InstallationAvecDispositifDeStockageImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installationAvecDispositifDeStockage: boolean;
    importéeLe: DateTime.RawType;
    importéePar: Email.RawType;
  }
>;
