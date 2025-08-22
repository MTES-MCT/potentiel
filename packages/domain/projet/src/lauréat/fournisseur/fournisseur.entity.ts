import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { Fournisseur } from '.';

export type FournisseurEntity = Entity<
  'fournisseur',
  {
    identifiantProjet: string;
    misÀJourLe: DateTime.RawType;
    évaluationCarboneSimplifiée: number;
    fournisseurs: Array<Fournisseur.RawType>;
  }
>;
