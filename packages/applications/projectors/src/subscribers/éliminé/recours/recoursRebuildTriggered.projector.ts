import { Recours } from '@potentiel-domain/elimine';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../../infrastructure';

export const recoursRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Recours.RecoursEntity>(`recours|${id}`);
};
