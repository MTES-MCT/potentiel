import type { Entity } from '@potentiel-domain/entity';

import type { AutoritéCompétente } from './index.js';

export type DemandeRecoursEntity = Entity<
  'demande-recours',
  {
    identifiantProjet: string;
    statut: string;
    autoritéCompétente: AutoritéCompétente.RawType;
    miseÀJourLe: string;

    demande: {
      demandéPar: string;
      demandéLe: string;
      raison: string;
      pièceJustificative: {
        format: string;
      };

      instruction?: {
        passéEnInstructionLe: string;
        passéEnInstructionPar: string;
      };

      accord?: {
        réponseSignée: {
          format: string;
        };
        dateRéponseSignée?: string;
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

      annulation?: {
        annuléLe: string;
        annuléPar: string;
      };
    };
  }
>;
