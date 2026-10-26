import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { AutoritéCompétente, StatutAbandon } from '../index.js';

export type DemandeAbandonEntity = Entity<
  'demande-abandon',
  {
    identifiantProjet: string;
    statut: StatutAbandon.RawType;
    miseÀJourLe: DateTime.RawType;

    demande: {
      demandéPar: string;
      demandéLe: DateTime.RawType;
      raison: string;
      autoritéCompétente: AutoritéCompétente.RawType;
      annulation?: { annuléLe: DateTime.RawType; annuléPar: string };
      pièceJustificative?: {
        format: string;
      };

      estUneRecandidature: boolean;
      ppaSignalé?: true;

      recandidature?: {
        statut: string;
        preuve?: {
          demandéeLe: DateTime.RawType;
          identifiantProjet?: string;
          transmiseLe?: string;
          transmisePar?: string;
        };
      };

      confirmation?: {
        demandéePar: string;
        demandéeLe: DateTime.RawType;

        réponseSignée: {
          format: string;
        };

        confirméLe?: DateTime.RawType;
        confirméPar?: string;
      };

      instruction?: {
        passéEnInstructionLe: DateTime.RawType;
        passéEnInstructionPar: string;
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
