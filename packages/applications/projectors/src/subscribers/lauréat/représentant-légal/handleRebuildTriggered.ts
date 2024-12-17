import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../../infrastructure';

export const handleRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<ReprésentantLégal.ReprésentantLégalEntity>(`représentant-légal|${id}`);
  await removeProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${id}`,
  );
};
