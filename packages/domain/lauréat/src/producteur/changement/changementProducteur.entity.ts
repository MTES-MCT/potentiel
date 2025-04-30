import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementProducteurEntity = Entity<
  'changement-producteur',
  {
    identifiantProjet: string;

    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      ancienProducteur: string;
      nouveauProducteur: string;
      raison?: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;
