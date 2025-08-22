import type { Tâche } from '@potentiel-domain/tache';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Tâche.TâcheEntity>(`tâche|${id}`);
};
