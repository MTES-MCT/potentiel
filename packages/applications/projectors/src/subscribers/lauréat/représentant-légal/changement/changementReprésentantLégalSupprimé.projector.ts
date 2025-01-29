import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { removeProjection, upsertProjection } from '../../../../infrastructure';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal';

export const changementReprésentantLégalSuppriméProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await removeProjection(
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
