import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementActionnaireEntity = Entity<
  'changement-actionnaire',
  {
    identifiantProjet: string;

    projet: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      région: string;
    };

    demande: {
      nouvelActionnaire: string;
      statut: string;
      demandéePar: string;
      demandéeLe: DateTime.RawType;
      raison: string;
      pièceJustificative?: {
        format: string;
      };

      annulation?: {
        annuléePar: string;
        annuléeLe: DateTime.RawType;
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
