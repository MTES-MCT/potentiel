import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/candidature';

import { removeProjection } from '../../infrastructure/removeProjection';

export const candidatureRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await removeProjection<Candidature.CandidatureEntity>(`candidature|${payload.id}`);
};
