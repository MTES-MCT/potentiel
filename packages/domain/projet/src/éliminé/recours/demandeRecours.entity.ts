import { Entity } from '@potentiel-domain/entity';

export type DemandeRecoursEntity = Entity<
  'demande-recours',
  {
    identifiantProjet: string;

    statut: string;
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
