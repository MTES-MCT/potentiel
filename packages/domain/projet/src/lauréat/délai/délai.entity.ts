import { Entity } from '@potentiel-domain/entity';

export type ChangementReprésentantLégalEntity = Entity<
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
      nomReprésentantLégal: string;
      typeReprésentantLégal: string;
      accordéLe: string;
      accordéPar: string;
    };

    rejet?: {
      motif: string;
      rejetéLe: string;
      rejetéPar: string;
    };
  }
>;
