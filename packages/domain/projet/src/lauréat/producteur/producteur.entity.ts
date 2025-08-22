import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

export type ProducteurEntity = Entity<
  'producteur',
  {
    identifiantProjet: string;
    nom: string;
    misÀJourLe: DateTime.RawType;
  }
>;
