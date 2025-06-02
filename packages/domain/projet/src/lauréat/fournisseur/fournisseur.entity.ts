import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { ChampsFournisseurDétails } from './types';

export type FournisseurEntity = Entity<
  'fournisseur',
  {
    identifiantProjet: string;
    nom: string;
    misÀJourLe: DateTime.RawType;
    évaluationCarboneSimplifiée: number;
    details: ChampsFournisseurDétails;
  }
>;
