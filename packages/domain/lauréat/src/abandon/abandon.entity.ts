import { Entity } from '@potentiel-domain/core';

export type AbandonEntity = Entity<
  'abandon',
  {
    identifiantProjet: string;

    projet?: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
      région: string;
    };

    demande: {
      demandéPar: string;
      demandéLe: string;
      raison: string;
      pièceJustificative?: {
        format: string;
      };

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

export type AbandonAvecRecandidatureSansPreuveProjection = Entity<
  'abandon-avec-recandidature-sans-preuve',
  {
    identifiantProjet: string;
    demandéeLe: string;
  }
>;
