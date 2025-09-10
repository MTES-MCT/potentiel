import { Entity } from '@potentiel-domain/entity';

export type TâcheEntity = Entity<
  'tâche',
  {
    identifiantProjet: string;

    typeTâche: string;
    misÀJourLe: string;
  }
>;
