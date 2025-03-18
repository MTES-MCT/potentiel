import { Recours } from '@potentiel-domain/elimine';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Recours.RecoursEntity>(`recours|${id}`);
};
