import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers';

export const tâchePlanifiéeRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>('tâche-planifiée', id);
};
