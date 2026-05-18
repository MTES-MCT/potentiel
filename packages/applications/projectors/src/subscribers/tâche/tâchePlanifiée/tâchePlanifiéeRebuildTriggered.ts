import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers/index.js';

export const tâchePlanifiéeRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>('tâche-planifiée', id);
};
