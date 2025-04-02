import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { RèglesRatioPuissance, StatutChangementPuissance } from '..';

export type ChangementPuissanceEntity = Entity<
  'changement-puissance',
  {
    identifiantProjet: string;

    demande: {
      nouvellePuissance: number;
      autoritéCompétente: RèglesRatioPuissance.AutoritésCompétentes;
      statut: StatutChangementPuissance.RawType;
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      raison: string;
      pièceJustificative: {
        format: string;
      };

      accord?: {
        réponseSignée: {
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
