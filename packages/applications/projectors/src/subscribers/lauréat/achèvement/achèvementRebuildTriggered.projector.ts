import { Achèvement } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../../infrastructure';

export const achèvementRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<Achèvement.AchèvementEntity>(`achevement|${id}`);
};
