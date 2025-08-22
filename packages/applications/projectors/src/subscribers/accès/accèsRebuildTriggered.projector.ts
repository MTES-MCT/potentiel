import type { Accès } from '@potentiel-domain/projet';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const accèsRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await removeProjection<Accès.AccèsEntity>(`accès|${payload.id}`);
};
