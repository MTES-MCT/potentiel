import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../../infrastructure';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal';

export const changementReprésentantLégalRejetéProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const {
    payload: { identifiantProjet, motifRejet, rejetéLe, rejetéPar },
  } = event;

  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
      {
        ...représentantLégal.changementEnCours,
        demande: {
          ...représentantLégal.changementEnCours.demande,
          statut: ReprésentantLégal.StatutChangementReprésentantLégal.rejeté.formatter(),
          rejet: {
            motif: motifRejet,
            rejetéLe,
            rejetéPar,
          },
        },
      },
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
