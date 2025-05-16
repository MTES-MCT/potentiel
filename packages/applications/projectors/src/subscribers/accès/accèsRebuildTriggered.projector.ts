import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const accèsRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await removeProjection<Accès.AccèsEntity>(`accès|${payload.id}`);
};
