import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { StatutChangementPuissance } from '../index.js';

export type ChangementPuissanceEntity = Entity<
  'changement-puissance',
  {
    identifiantProjet: string;
    statut: StatutChangementPuissance.RawType;
    miseÀJourLe: string;

    demande: {
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      nouvellePuissance: number;
      nouvellePuissanceDeSite?: number;
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
