import type { Entity } from '@potentiel-domain/entity';

import type { StatutChangementReprésentantLégal } from '../index.js';

export type ChangementReprésentantLégalEntity = Entity<
  'changement-représentant-légal',
  {
    identifiantProjet: string;
    statut: StatutChangementReprésentantLégal.RawType;
    miseÀJourLe: string;

    demande: {
      nomReprésentantLégal: string;
      typeReprésentantLégal: string;
      demandéeLe: string;
      demandéePar: string;
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
