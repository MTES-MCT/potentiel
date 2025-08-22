import type { Lauréat } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(`tâche-planifiée|${id}`);
};
