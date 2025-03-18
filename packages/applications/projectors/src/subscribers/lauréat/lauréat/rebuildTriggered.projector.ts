import { Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const rebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);
};
