import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers';

export const tâcherebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.Tâche.TâcheEntity>('tâche', id);
};
