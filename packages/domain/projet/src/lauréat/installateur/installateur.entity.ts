import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type InstallateurEntity = Entity<
  'installateur',
  {
    identifiantProjet: string;
    installateur: string;
    misÀJourLe: DateTime.RawType;
  }
>;
