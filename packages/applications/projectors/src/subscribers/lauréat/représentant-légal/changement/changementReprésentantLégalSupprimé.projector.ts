import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal.js';

export const changementReprésentantLégalSuppriméProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await removeProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
    );

    await upsertProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
      {
        identifiantProjet,
        nomReprésentantLégal: représentantLégal.actuel.nom,
        typeReprésentantLégal: représentantLégal.actuel.type,
      },
    );
  }
};
