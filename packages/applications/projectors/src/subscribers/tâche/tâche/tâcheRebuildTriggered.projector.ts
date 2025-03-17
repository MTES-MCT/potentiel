import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { TâcheEntity } from '@potentiel-domain/tache';

export const tâcheRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<TâcheEntity>(`tâche|${id}`);
};
