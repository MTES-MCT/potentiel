import { Entity } from '@potentiel-domain/entity';

export type AccèsEntity = Entity<
  'accès',
  {
    identifiantProjet: string;
    utilisateursAyantAccès: Array<string>;
  }
>;
