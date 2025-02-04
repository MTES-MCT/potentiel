import { Entity } from '@potentiel-domain/entity';

export type ReprésentantLégalEntity = Entity<
  'représentant-légal',
  {
    identifiantProjet: string;
    nomReprésentantLégal: string;
    typeReprésentantLégal: string;

    dernièreDemande?: {
      demandéLe: string;
      statut: string;
    };
  }
>;
