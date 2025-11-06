import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/projet';

import { rebuildProjection } from '../../../helpers';

export const éliminéRebuildTriggeredProjector = async (event: RebuildTriggered) => {
  await rebuildProjection<Éliminé.ÉliminéEntity>('éliminé', event.payload.id);
};
