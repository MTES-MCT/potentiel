import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${id}`);
};
