import { Entity } from '@potentiel-domain/core';

export type TâcheEntity = Entity<
  'tâche',
  {
    identifiantProjet: string;

    nomProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;

    typeTâche: string;
    misÀJourLe: string;
  }
>;
