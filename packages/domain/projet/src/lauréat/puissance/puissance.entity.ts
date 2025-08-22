import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

export type PuissanceEntity = Entity<
  'puissance',
  {
    identifiantProjet: string;
    puissance: number;
    miseÀJourLe: DateTime.RawType;
    dateDemandeEnCours?: DateTime.RawType;
  }
>;
