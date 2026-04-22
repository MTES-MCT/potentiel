import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { NuméroImmatriculation } from './index.js';

export type ProducteurEntity = Entity<
  'producteur',
  {
    identifiantProjet: string;
    nom: string;
    numéroImmatriculation: NuméroImmatriculation.RawType;
    miseÀJourLe: DateTime.RawType;
  }
>;
