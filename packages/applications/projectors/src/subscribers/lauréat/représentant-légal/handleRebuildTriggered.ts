import { Lauréat } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { upsertProjection } from '../../../infrastructure';

export const handleRebuilTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

  if (Option.isSome(lauréatProjection)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { représentantLégal, ...lauréatSansReprésentantLégal } = lauréatProjection;

    await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, lauréatSansReprésentantLégal);
  }
};
