import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { Fournisseur } from './index.js';

export type FournisseurEntity = Entity<
  'fournisseur',
  {
    identifiantProjet: string;
    miseÀJourLe: DateTime.RawType;
    évaluationCarboneSimplifiée: number;
    fournisseurs: Array<Fournisseur.RawType>;
  }
>;
