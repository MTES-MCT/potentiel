import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type InstallationAvecDispositifDeStockageEntity = Entity<
  'installation-avec-dispositif-de-stockage',
  {
    identifiantProjet: string;
    installationAvecDispositifDeStockage: boolean;
    miseÀJourLe: DateTime.RawType;
  }
>;
