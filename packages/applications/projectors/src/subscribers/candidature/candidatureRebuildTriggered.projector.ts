import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/candidature';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await removeProjection<Candidature.CandidatureEntity>(`candidature|${payload.id}`);
};
