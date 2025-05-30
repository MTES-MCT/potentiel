import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { AutoritéCompétente, StatutChangementPuissance } from '..';

export type ChangementPuissanceEntity = Entity<
  'changement-puissance',
  {
    identifiantProjet: string;

    demande: {
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      nouvellePuissance: number;
      statut: StatutChangementPuissance.RawType;
      autoritéCompétente?: AutoritéCompétente.RawType;
      raison?: string;
      pièceJustificative?: {
        format: string;
      };
      accord?: {
        réponseSignée?: {
          format: string;
        };
        accordéePar: string;
        accordéeLe: DateTime.RawType;
      };

      rejet?: {
        réponseSignée: {
          format: string;
        };
        rejetéePar: string;
        rejetéeLe: DateTime.RawType;
      };
    };
  }
>;
