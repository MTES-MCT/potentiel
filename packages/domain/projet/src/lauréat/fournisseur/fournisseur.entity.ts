import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { Fournisseur } from '.';

export type FournisseurEntity = Entity<
  'fournisseur',
  {
    identifiantProjet: string;
    miseÀJourLe: DateTime.RawType;
    évaluationCarboneSimplifiée: number;
    fournisseurs: Array<Fournisseur.RawType>;
  }
>;
