import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementProducteurEntity = Entity<
  'changement-producteur',
  {
    identifiantProjet: string;

    demande: {
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      nouveauProducteur: string;
      raison?: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;
