import { Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../infrastructure';

export const rebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);
};
