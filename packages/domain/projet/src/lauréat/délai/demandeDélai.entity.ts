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
      passéeEnInstructionLe: string;
      passéeEnInstructionPar: string;
    };

    accord?: {
      accordéeLe: string;
      accordéePar: string;
      nombreDeMois: number;
      réponseSignée: {
        format: string;
      };
    };

    rejet?: {
      rejetéeLe: string;
      rejetéePar: string;
      motif: string;
      réponseSignée: {
        format: string;
      };
    };
  }
>;
