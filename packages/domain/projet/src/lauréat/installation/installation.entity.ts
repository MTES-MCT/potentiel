import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../index.js';
import { TypologieInstallation } from '../../candidature/index.js';

import { DispositifDeStockage } from './index.js';

export type InstallationEntity = Entity<
  'installation',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    miseÀJourLe: DateTime.RawType;
    installateur: string;
    typologieInstallation: TypologieInstallation.RawType[];
    dispositifDeStockage?: DispositifDeStockage.RawType;
  }
>;
