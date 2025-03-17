import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { TâchePlanifiéeEntity } from '@potentiel-domain/tache-planifiee';

export const tâchePlanifiéeRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<TâchePlanifiéeEntity>(`tâche-planifiée|${id}`);
};
