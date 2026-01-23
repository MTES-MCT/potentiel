import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/projet';

import { clearProjection } from '../../helpers/index.js';

export const candidatureRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await clearProjection<Candidature.CandidatureEntity>(`candidature`, payload.id);
};
