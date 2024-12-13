import { Entity } from '@potentiel-domain/entity';

export type ChangementReprésentantLégalEntity = Entity<
  'changement-représentant-légal',
  {
    identifiantProjet: string;
    statut: string;
    demande: {
      nomReprésentantLégal: string;
      typeReprésentantLégal: string;
      demandéLe: string;
      demandéPar: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;
