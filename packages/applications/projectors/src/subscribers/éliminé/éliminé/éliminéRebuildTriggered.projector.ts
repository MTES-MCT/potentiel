import { Éliminé } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers/index.js';

export const éliminéRebuildTriggeredProjector = async (event: RebuildTriggered) => {
  await clearProjection<Éliminé.ÉliminéEntity>('éliminé', event.payload.id);
};
