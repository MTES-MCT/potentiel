import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementPuissanceEntity = Entity<
  'changement-puissance',
  {
    identifiantProjet: string;

    demande: {
      nouvelPuissance: string;
      statut: string;
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      // serait utilisé pour enregistré et la demande
      // d'où l'optionnel
      raison?: string;
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
