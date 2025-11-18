import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';

import { clearProjection } from '../../helpers';

import { seedPériodes } from './seed';

export const périodeRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Période.PériodeEntity>('période', id);

  await seedPériodes();
};
