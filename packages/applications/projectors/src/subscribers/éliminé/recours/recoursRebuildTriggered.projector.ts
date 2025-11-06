import { Éliminé } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { rebuildProjection } from '../../../helpers';

export const recoursRebuildTriggeredProjector = async ({ payload: { id } }: RebuildTriggered) => {
  await rebuildProjection<Éliminé.Recours.RecoursEntity>(`recours`, id);
};
