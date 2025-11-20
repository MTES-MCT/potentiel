import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/projet';

import { clearProjection } from '../../../helpers';

export const éliminéRebuildTriggeredProjector = async (event: RebuildTriggered) => {
  await clearProjection<Éliminé.ÉliminéEntity>('éliminé', event.payload.id);
};
