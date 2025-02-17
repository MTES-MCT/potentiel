import { Entity } from '@potentiel-domain/entity';

export type ChangementReprésentantLégalEntity = Entity<
  'changement-représentant-légal',
  {
    identifiantProjet: string;
    projet: {
      nom: string;
      région: string;
      appelOffre: string;
      période: string;
      famille?: string;
    };
    demande: {
      statut: string;
      nomReprésentantLégal: string;
      typeReprésentantLégal: string;
      demandéLe: string;
      demandéPar: string;
      pièceJustificative: {
        format: string;
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
    };
  }
>;
