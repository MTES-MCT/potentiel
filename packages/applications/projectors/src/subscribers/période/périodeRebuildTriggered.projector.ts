import type { Période } from '@potentiel-domain/periode';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const périodeRebuildTriggered = async (event: RebuildTriggered) => {
  await removeProjection<Période.PériodeEntity>(`période|${event.payload.id}`);
};
