import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementInstallateurEntity = Entity<
  'changement-installateur',
  {
    identifiantProjet: string;

    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      installateur: string;
      raison: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;
