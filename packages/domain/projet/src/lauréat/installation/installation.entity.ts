import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../..';
import { TypologieInstallation } from '../../candidature';

import { DispositifDeStockage } from '.';

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
