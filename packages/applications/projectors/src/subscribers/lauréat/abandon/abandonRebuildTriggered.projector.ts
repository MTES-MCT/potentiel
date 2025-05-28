import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { AbandonBen } from '@potentiel-domain/laureat';

export const abandonRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<AbandonBen.AbandonEntity>(`abandon|${id}`);
};
