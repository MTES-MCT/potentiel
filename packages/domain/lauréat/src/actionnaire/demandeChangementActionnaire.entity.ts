import { Entity } from '@potentiel-domain/entity';

export type ChangementActionnaireEntity = Entity<
  'changement-actionnaire',
  {
    identifiantProjet: string;

    statut: string;
    misÀJourLe: string;

    demande: {
      demandéPar: string;
      demandéLe: string;
      raison?: string;
      pièceJustificative: {
        format: string;
      };

      accord?: {
        réponseSignée: {
          format: string;
        };
        accordéPar: string;
        accordéLe: string;
      };

      rejet?: {
        réponseSignée: {
          format: string;
        };
        rejetéPar: string;
        rejetéLe: string;
      };
    };
  }
>;
