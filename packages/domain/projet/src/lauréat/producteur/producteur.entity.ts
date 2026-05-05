import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { NuméroIdentification } from './index.js';

export type ProducteurEntity = Entity<
  'producteur',
  {
    identifiantProjet: string;
    nom: string;
    miseÀJourLe: DateTime.RawType;
    numéroIdentification?: NuméroIdentification.RawType;
  }
>;
