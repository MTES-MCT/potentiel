import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

export type ChangementActionnaireEntity = Entity<
  'actionnaire',
  {
    identifiantProjet: string;

    actionnaire: { nom: string; misÀJourLe: DateTime.RawType };

    demande: {
      statut: string;
      demandéPar: string;
      demandéLe: DateTime.RawType;
      raison?: string;
      pièceJustificative: {
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
