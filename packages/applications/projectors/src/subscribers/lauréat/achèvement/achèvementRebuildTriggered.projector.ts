import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { rebuildProjection } from '../../../helpers';

export const achèvementRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await rebuildProjection<Lauréat.Achèvement.AchèvementEntity>(`achèvement`, id);
};
