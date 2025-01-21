import { Entity } from '@potentiel-domain/entity';

export type ChangementReprésentantLégalEntity = Entity<
  'changement-représentant-légal',
  {
    identifiantChangement: string;
    identifiantProjet: string;

    projet: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
      région: string;
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
