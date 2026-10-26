import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { StatutChangementActionnaire } from './index.js';

export type ChangementActionnaireEntity = Entity<
  'changement-actionnaire',
  {
    identifiantProjet: string;
    statut: StatutChangementActionnaire.RawType;
    miseÀJourLe: string;

    demande: {
      nouvelActionnaire: string;
      demandéPar: string;
      demandéLe: DateTime.RawType;
      raison: string;
      pièceJustificative?: {
        format: string;
      };

      accord?: {
        réponseSignée: {
          format: string;
        };
        accordéPar: string;
        accordéLe: DateTime.RawType;
      };

      rejet?: {
        réponseSignée: {
          format: string;
        };
        rejetéPar: string;
        rejetéLe: DateTime.RawType;
      };
    };
  }
>;
