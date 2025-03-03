import { Entity } from '@potentiel-domain/entity';

export type AbandonEntity = Entity<
  'abandon',
  {
    identifiantProjet: string;

    projet?: {
      nom: string;
      région: string;
      appelOffre: string;
      période: string;
      famille?: string;
    };

    demande: {
      demandéPar: string;
      demandéLe: string;
      raison: string;
      pièceJustificative?: {
        format: string;
      };

      estUneRecandidature: boolean;

      recandidature?: {
        statut: string;
        preuve?: {
          demandéeLe: string;
          identifiantProjet?: string;
          transmiseLe?: string;
          transmisePar?: string;
        };
      };

      confirmation?: {
        demandéePar: string;
        demandéeLe: string;

        réponseSignée: {
          format: string;
        };

        confirméLe?: string;
        confirméPar?: string;
      };

      instruction?: {
        instruitLe: string;
        instruitPar: string;
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
