import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Éliminé } from '@potentiel-domain/projet';

export const éliminéRebuildTriggeredProjector = async (event: RebuildTriggered) => {
  await removeProjection<Éliminé.ÉliminéEntity>(`éliminé|${event.payload.id}`);
};
