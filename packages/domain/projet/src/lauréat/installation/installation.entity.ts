import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type InstallationEntiry = Entity<
  'installation',
  {
    identifiantProjet: string;
    misÀJourLe: DateTime.RawType;
    installateur: string;
  }
>;
