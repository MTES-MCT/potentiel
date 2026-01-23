import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../../helpers/index.js';

export const achèvementRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<Lauréat.Achèvement.AchèvementEntity>(`achèvement`, id);
};
