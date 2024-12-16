import { Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection, upsertProjection } from '../../../infrastructure';

export const handleRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

  if (Option.isSome(lauréatProjection) && lauréatProjection.représentantLégal) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { représentantLégal, ...restLauréat } = lauréatProjection;
    await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, restLauréat);
  }

  await removeProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${id}`,
  );
};
