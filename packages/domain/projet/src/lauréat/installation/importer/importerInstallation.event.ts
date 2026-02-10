import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';
import { TypologieInstallation } from '../../../candidature/index.js';
import { DispositifDeStockage } from '../index.js';

export type InstallationImportéeEvent = DomainEvent<
  'InstallationImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur: string;
    typologieInstallation: TypologieInstallation.RawType[];
    dispositifDeStockage?: DispositifDeStockage.RawType;
    importéeLe: DateTime.RawType;
    importéePar: Email.RawType;
  }
>;
