import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { rebuildProjection } from '../../../helpers';

export const tâcherebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await rebuildProjection<Lauréat.Tâche.TâcheEntity>('tâche', id);
};
