import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../../../infrastructure';

export const changementReprésentantLégalRejetéProjector = async (
  event: ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const {
    payload: { identifiantProjet, motifRejet, rejetéLe, rejetéPar },
  } = event;

  const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal)) {
    getLogger().error(
      `Aucun représentant légal n'a été trouvé pour le changement de représentant rejeté`,
      {
        event,
      },
    );
    return;
  }
  if (!représentantLégal.demandeEnCours) {
    getLogger().error(`Aucune demande en cours pour le changement de représentant rejeté`, {
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
      `Aucun changement de représentant légal n'a été trouvé pour le changement de représentant rejeté`,
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
      nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
      typeReprésentantLégal: représentantLégal.typeReprésentantLégal,
    },
  );
};
