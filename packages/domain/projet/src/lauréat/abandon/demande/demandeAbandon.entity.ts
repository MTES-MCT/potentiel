import { Entity } from '@potentiel-domain/entity';

import { AutoritéCompétente, StatutAbandon } from '..';

export type DemandeAbandonEntity = Entity<
  'demande-abandon',
  {
    identifiantProjet: string;

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
        passéEnInstructionLe: string;
        passéEnInstructionPar: string;
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

      annulation?: { annuléLe: string; annuléPar: string };

      autoritéCompétente: AutoritéCompétente.RawType;
    };

    statut: StatutAbandon.RawType;
    miseÀJourLe: string;
  }
>;
