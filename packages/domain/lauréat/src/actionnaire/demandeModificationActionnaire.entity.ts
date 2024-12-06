import { Entity } from '@potentiel-domain/entity';

export type AbandonEntity = Entity<
  'demande-modification-actionnaire',
  {
    identifiantProjet: string;

    // peut être besoin de l'AO ?
    // projet?: {
    //   nom: string;
    //   appelOffre: string;
    //   période: string;
    //   famille?: string;
    //   numéroCRE: string;
    //   région: string;
    // };

    demande: {
      demandéPar: string;
      demandéLe: string;
      raison: string;
      pièceJustificative?: {
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

    statut: string;
    misÀJourLe: string;
  }
>;
