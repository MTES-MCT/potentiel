import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementNomProjetEntity = Entity<
  'changement-nom-projet',
  {
    identifiantProjet: string;
    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      nomProjet: string;
      raison?: string;
      pièceJustificative?: {
        format: string;
      };
    };
  }
>;
