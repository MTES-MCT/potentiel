import { Entity } from '@potentiel-domain/entity';

export type DemandeDélaiEntity = Entity<
  'demande-délai',
  {
    identifiantProjet: string;

    statut: string;
    nombreDeMois: number;
    raison: string;
    demandéLe: string;
    demandéPar: string;
    pièceJustificative: {
      format: string;
    };

    instruction?: {
      passéEnInstructionLe: string;
      passéEnInstructionPar: string;
    };

    accord?: {
      accordéLe: string;
      accordéPar: string;
      nombreDeMois: number;
      réponseSignée: {
        format: string;
      };
    };

    rejet?: {
      rejetéLe: string;
      rejetéPar: string;
      motif: string;
      réponseSignée: {
        format: string;
      };
    };
  }
>;
