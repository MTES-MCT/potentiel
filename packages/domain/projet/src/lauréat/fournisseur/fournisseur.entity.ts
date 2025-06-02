import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { TypeFournisseur } from '.';

export type FournisseurEntity = Entity<
  'fournisseur',
  {
    identifiantProjet: string;
    misÀJourLe: DateTime.RawType;
    évaluationCarboneSimplifiée: number;
    fournisseurs: Array<{
      typeFournisseur: TypeFournisseur.RawType;
      nomDuFabricant: string;
    }>;
  }
>;
