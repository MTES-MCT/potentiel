import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type PuissanceEntity = Entity<
  'puissance',
  {
    identifiantProjet: string;
    appelOffre: string;
    puissance: number;
    miseÀJourLe: DateTime.RawType;
    dateDemandeEnCours?: DateTime.RawType;
  }
>;
