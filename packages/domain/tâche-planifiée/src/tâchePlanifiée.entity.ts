import { Entity } from '@potentiel-domain/core';

export type TâchePlanifiéeEntity = Entity<
  'tâche-planifiée',
  {
    identifiantProjet: string;

    typeTâche: string;
    misÀJourLe: string;
    àExécuterLe: string;
  }
>;
