import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';

import { rebuildProjection } from '../../helpers';

export const périodeRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await rebuildProjection<Période.PériodeEntity>('période', id);
};
