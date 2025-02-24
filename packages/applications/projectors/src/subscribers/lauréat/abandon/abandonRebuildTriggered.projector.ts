import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Abandon } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../infrastructure';

export const abandonRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Abandon.AbandonEntity>(`abandon|${id}`);
};
