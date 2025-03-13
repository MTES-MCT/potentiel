import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Éliminé } from '@potentiel-domain/elimine';

import { removeProjection } from '../../../infrastructure/removeProjection';

export const éliminéRebuildTriggeredProjector = async (event: RebuildTriggered) => {
  await removeProjection<Éliminé.ÉliminéEntity>(`éliminé|${event.payload.id}`);
};
