import type { Candidature } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../helpers/index.js';

export const candidatureRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await clearProjection<Candidature.CandidatureEntity>(`candidature`, payload.id);
};
