import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâcheEntity } from '@potentiel-domain/tache';

import { removeProjection } from '../../../infrastructure';

export const tâcheRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<TâcheEntity>(`tâche|${id}`);
};
