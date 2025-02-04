import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { updateOneProjection, upsertProjection } from '../../../../infrastructure';

import { getInfosReprésentantLégal } from './_utils/getInfosReprésentantLégal';

export const changementReprésentantLégalAccordéProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
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
    await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${représentantLégal.identifiantChangement}`,
      {
        ...représentantLégal.changementEnCours,
        demande: {
          ...représentantLégal.changementEnCours.demande,
          statut: ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
          accord: {
            nomReprésentantLégal,
            typeReprésentantLégal,
            accordéLe,
            accordéPar,
          },
        },
      },
    );

    await updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
      {
        nomReprésentantLégal,
        typeReprésentantLégal,
        dernièreDemande: {
          demandéLe: représentantLégal.changementEnCours.demande.demandéLe,
          statut: ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
        },
      },
    );
  }
};
