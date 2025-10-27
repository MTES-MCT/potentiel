import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal';

export const changementReprésentantLégalRejetéProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const {
    payload: { identifiantProjet, motifRejet, rejetéLe, rejetéPar },
  } = event;

  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await upsertProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
      {
        ...représentantLégal.changementEnCours,
        miseÀJourLe: rejetéLe,
        demande: {
          ...représentantLégal.changementEnCours.demande,
          statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.rejeté.formatter(),
          rejet: {
            motif: motifRejet,
            rejetéLe,
            rejetéPar,
          },
        },
      },
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
