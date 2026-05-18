import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { NuméroIdentification } from './index.js';

export type ProducteurEntity = Entity<
  'producteur',
  {
    identifiantProjet: string;
    nom: string;
    miseÀJourLe: DateTime.RawType;
    numéroIdentification?: NuméroIdentification.RawType;
  }
>;
