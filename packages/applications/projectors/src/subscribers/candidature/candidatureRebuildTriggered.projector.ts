import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/projet';

import { rebuildProjection } from '../../helpers';

export const candidatureRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await rebuildProjection<Candidature.CandidatureEntity>(`candidature`, payload.id);
};
