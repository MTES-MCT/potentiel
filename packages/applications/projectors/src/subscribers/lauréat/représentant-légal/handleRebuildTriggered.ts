import { Lauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { updateOneProjection } from '../../../infrastructure';

export const handleRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

  if (Option.isSome(lauréatProjection)) {
    await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, {
      représentantLégal: undefined,
    });
  }
};
