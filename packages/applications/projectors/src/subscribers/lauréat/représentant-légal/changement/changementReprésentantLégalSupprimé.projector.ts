import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { removeProjection, updateOneProjection } from '../../../../infrastructure';

export const changementReprésentantLégalSuppriméProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal)) {
    getLogger().warn(
      `Aucun représentant légal n'a été trouvé pour le changement de représentant supprimé`,
      {
        event,
      },
    );
    return;
  }
  if (!représentantLégal.demandeEnCours) {
    getLogger().warn(`Aucune demande n'a été trouvée pour le changement de représentant supprimé`, {
      event,
    });
    return;
  }

  const identifiantChangement = `${identifiantProjet}#${représentantLégal.demandeEnCours.demandéLe}`;

  await removeProjection(`changement-représentant-légal|${identifiantChangement}`);

  await updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      demandeEnCours: undefined,
    },
  );
};
