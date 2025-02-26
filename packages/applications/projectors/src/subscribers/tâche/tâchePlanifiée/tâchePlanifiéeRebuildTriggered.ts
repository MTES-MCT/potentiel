import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeEntity } from '@potentiel-domain/tache-planifiee';

import { removeProjection } from '../../../infrastructure';

export const tâchePlanifiéeRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<TâchePlanifiéeEntity>(`tâche-planifiée|${id}`);
};
