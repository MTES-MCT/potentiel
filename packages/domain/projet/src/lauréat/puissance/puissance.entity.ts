import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type PuissanceEntity = Entity<
  'puissance',
  {
    identifiantProjet: string;
    appelOffres: string;
    puissance: number;
    miseÀJourLe: DateTime.RawType;
    dateDemandeEnCours?: DateTime.RawType;
  }
>;
