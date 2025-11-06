import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';

import { rebuildProjection } from '../../helpers';

export const accèsRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await rebuildProjection<Accès.AccèsEntity>('accès', payload.id);
};
