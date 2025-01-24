import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { removeProjection, upsertProjection } from '../../../../infrastructure';

export const changementReprésentantLégalAnnuléProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal)) {
    getLogger().error(
      `Aucun représentant légal n'a été trouvé pour le changement de représentant annulé`,
      {
        event,
      },
    );
    return;
  }
  if (!représentantLégal.demandeEnCours) {
    getLogger().error(`Aucune demande en cours pour le changement de représentant annulé`, {
      event,
    });
    return;
  }

  const identifiantChangement = `${identifiantProjet}#${représentantLégal.demandeEnCours.demandéLe}`;

  await removeProjection(`changement-représentant-légal|${identifiantChangement}`);

  await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
      typeReprésentantLégal: représentantLégal.typeReprésentantLégal,
    },
  );
};
