import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';

import { clearProjection } from '../../helpers/index.js';

export const accèsRebuildTriggeredProjector = async ({ payload }: RebuildTriggered) => {
  await clearProjection<Accès.AccèsEntity>('accès', payload.id);
};
