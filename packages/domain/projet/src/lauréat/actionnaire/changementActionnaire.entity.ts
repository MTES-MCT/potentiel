import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementActionnaireEntity = Entity<
  'changement-actionnaire',
  {
    identifiantProjet: string;

    miseÀJourLe: string;

    demande: {
      nouvelActionnaire: string;
      statut: string;
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      raison: string;
      pièceJustificative?: {
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
