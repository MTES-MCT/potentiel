import { Option } from '@potentiel-libraries/monads';
import { Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const handleReprésentantLégalModifié = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal },
}: ReprésentantLégal.ReprésentantLégalModifiéEvent) => {
  const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(
    `lauréat|${identifiantProjet}`,
  );

  if (Option.isNone(lauréatProjection)) {
    getLogger().error(
      new Error(
        `[${new Date().toISOString()}] [System.Projector.Lauréat.ReprésentantLégal] Projection lauréat non trouvée pour le projet ${identifiantProjet}`,
      ),
    );
    return;
  }

  await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    ...lauréatProjection,
    représentantLégal: {
      nom: nomReprésentantLégal,
      type: typeReprésentantLégal,
    },
  });
};
