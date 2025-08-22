import type { Éliminé } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const éliminéRebuildTriggeredProjector = async (event: RebuildTriggered) => {
  await removeProjection<Éliminé.ÉliminéEntity>(`éliminé|${event.payload.id}`);
};
