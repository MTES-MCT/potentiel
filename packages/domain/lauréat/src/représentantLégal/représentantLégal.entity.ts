import { Entity } from '@potentiel-domain/entity';

export type ReprésentantLégalEntity = Entity<
  'représentant-légal',
  {
    identifiantProjet: string;
    nomReprésentantLégal: string;
    import: {
      importéLe: string;
      importéPar: string;
    };
  }
>;
