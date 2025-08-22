import type { Candidature } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await removeProjection<Candidature.CandidatureEntity>(`candidature|${payload.id}`);
};
