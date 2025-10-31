import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { StatutChangementPuissance } from '..';

export type ChangementPuissanceEntity = Entity<
  'changement-puissance',
  {
    identifiantProjet: string;

    miseÀJourLe: string;

    demande: {
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      nouvellePuissance: number;
      nouvellePuissanceDeSite?: number;
      statut: StatutChangementPuissance.RawType;
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
