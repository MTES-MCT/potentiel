import { Entity } from '@potentiel-domain/core';

type TâcheCommon = {
  identifiantProjet: string;

  typeTâche: string;
  misÀJourLe: string;
};

export type TâcheEntity = Entity<
  'tâche',
  TâcheCommon & {
    projet?: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
    };
  }
>;

export type TâchePlanifiéeEntity = Entity<
  'tâche-planifiée',
  TâcheCommon & {
    àExecuterLe: string;
  }
>;
