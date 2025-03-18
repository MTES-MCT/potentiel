import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Abandon } from '@potentiel-domain/laureat';

export const abandonRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Abandon.AbandonEntity>(`abandon|${id}`);
};
