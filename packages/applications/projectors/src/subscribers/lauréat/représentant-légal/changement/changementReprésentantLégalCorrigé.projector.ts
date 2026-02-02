import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal.js';

export const changementReprésentantLégalCorrigéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal, pièceJustificative },
}: Lauréat.ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent) => {
  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await upsertProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
      {
        ...représentantLégal.changementEnCours,
        demande: {
          ...représentantLégal.changementEnCours.demande,
          nomReprésentantLégal,
          typeReprésentantLégal,
          ...(pièceJustificative && {
            pièceJustificative,
          }),
        },
      },
    );
  }
};
