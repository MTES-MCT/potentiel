import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../../infrastructure';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal';

export const changementReprésentantLégalCorrigéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal, pièceJustificative },
}: ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent) => {
  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
      {
        ...représentantLégal.changementEnCours,
        demande: {
          ...représentantLégal.changementEnCours.demande,
          nomReprésentantLégal,
          typeReprésentantLégal,
          pièceJustificative,
        },
      },
    );
  }
};
