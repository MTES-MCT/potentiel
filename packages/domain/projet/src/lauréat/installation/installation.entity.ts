import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { TypologieInstallation } from '../../candidature/index.js';
import type { IdentifiantProjet } from '../../index.js';
import type { DispositifDeStockage } from './index.js';

export type InstallationEntity = Entity<
  'installation',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    miseÀJourLe: DateTime.RawType;
    installateur?: string;
    typologieInstallation?: TypologieInstallation.RawType[];
    dispositifDeStockage?: DispositifDeStockage.RawType;
  }
>;
