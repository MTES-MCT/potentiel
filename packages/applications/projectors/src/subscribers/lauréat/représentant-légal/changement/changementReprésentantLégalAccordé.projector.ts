import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal.js';

export const changementReprésentantLégalAccordéProjector = async (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) => {
  const {
    payload: {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      accordéLe,
      accordéPar,
    },
  } = event;

  const représentantLégal = await getInfosReprésentantLégal(identifiantProjet);

  if (représentantLégal) {
    await upsertProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
      {
        ...représentantLégal.changementEnCours,
        miseÀJourLe: accordéLe,
        demande: {
          ...représentantLégal.changementEnCours.demande,
          statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
          accord: {
            nomReprésentantLégal,
            typeReprésentantLégal,
            accordéLe,
            accordéPar,
          },
        },
      },
    );
    await upsertProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
      {
        identifiantProjet,
        nomReprésentantLégal,
        typeReprésentantLégal,
      },
    );
  }
};
