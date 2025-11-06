import { RebuildAllTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjectionByCategory } from '@potentiel-infrastructure/pg-projection-write';
import { Candidature } from '@potentiel-domain/projet';

export const candidatureRebuildAllTriggered = async (_: RebuildAllTriggered) => {
  await removeProjectionByCategory<Candidature.CandidatureEntity>(`candidature`);
};
