import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type InstallateurEntity = Entity<
  'installateur',
  {
    identifiantProjet: string;
    installateur: string | undefined;
    misÀJourLe: DateTime.RawType;
  }
>;
