import type { Période } from '@potentiel-domain/periode';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../helpers/index.js';
import { seedPériodes } from './seed.js';

export const périodeRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Période.PériodeEntity>('période', id);

  await seedPériodes();
};
