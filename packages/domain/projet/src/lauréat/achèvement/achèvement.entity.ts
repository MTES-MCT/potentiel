import { Entity } from '@potentiel-domain/entity';

export type AchèvementEntity = Entity<
  'achèvement',
  {
    identifiantProjet: string;
    dateAchèvementPrévisionnel: string;
  }
>;
