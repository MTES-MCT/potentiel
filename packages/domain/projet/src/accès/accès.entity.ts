import { Entity } from '@potentiel-domain/entity';

export type AchèvementEntity = Entity<
  'accès',
  {
    identifiantProjet: string;
    utilisateursAyantAccès: Array<string>;
  }
>;
