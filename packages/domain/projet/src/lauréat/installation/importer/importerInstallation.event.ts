import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { TypologieInstallation } from '../../../candidature/index.js';
import type { IdentifiantProjet } from '../../../index.js';
import type { DispositifDeStockage } from '../index.js';

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
