import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

import { upsertProjection } from '../../../../infrastructure';

export const changementReprésentantLégalCorrigéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal, pièceJustificative },
}: ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent) => {
  const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal)) {
    getLogger().error(
      `Aucun représentant légal n'a été trouvé pour le changement de représentant accordé`,
      {
        event,
      },
    );
    return;
  }

  if (!représentantLégal.demandeEnCours) {
    getLogger().error(`Aucune demande en cours pour le changement de représentant accordé`, {
      event,
    });
    return;
  }

  const identifiantChangement = `${identifiantProjet}#${représentantLégal.demandeEnCours.demandéLe}`;

  const changementReprésentantLégal =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantChangement}`,
    );

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().error(
      `Aucun changement de représentant légal n'a été trouvé pour la correction de la demande`,
      {
        event,
      },
    );
    return;
  }

  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantChangement}`,
    {
      ...changementReprésentantLégal,
      demande: {
        ...changementReprésentantLégal.demande,
        nomReprésentantLégal,
        typeReprésentantLégal,
        pièceJustificative,
      },
    },
  );
};
