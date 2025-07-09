import { Entity } from '@potentiel-domain/entity';

export type ChangementDélaiEntity = Entity<
  'changement-délai',
  {
    identifiantProjet: string;

    demande?: {
      statut: string;
      nombreDeMois: number;
      raison: string;
      demandéLe: string;
      demandéPar: string;
      pièceJustificative: {
        format: string;
      };
    };

    accord?: {
      nombreDeMois: number;
      pièceJustificative: {
        format: string;
      };
      accordéLe: string;
      accordéPar: string;
    };

    rejet?: {
      pièceJustificative: {
        format: string;
      };
      rejetéLe: string;
      rejetéPar: string;
    };
  }
>;
