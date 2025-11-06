import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(`tâche-planifiée|${id}`);
};
