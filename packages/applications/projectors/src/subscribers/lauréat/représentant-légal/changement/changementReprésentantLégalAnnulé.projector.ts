import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal';

export const changementReprésentantLégalAnnuléProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await removeProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
    );

    await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
      {
        identifiantProjet,
        nomReprésentantLégal: représentantLégal.actuel.nom,
        typeReprésentantLégal: représentantLégal.actuel.type,
      },
    );
  }
};
