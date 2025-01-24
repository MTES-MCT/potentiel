import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../../../infrastructure';

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

  const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal)) {
    getLogger().warn(
      `Aucun représentant légal n'a été trouvé pour le changement de représentant accordé`,
      {
        event,
      },
    );
    return;
  }
  if (!représentantLégal.demandeEnCours) {
    getLogger().warn(`Aucune demande en cours pour le changement de représentant accordé`, {
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
    getLogger().warn(
      `Aucun changement de représentant légal n'a été trouvé pour le changement de représentant accordé`,
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

  await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );
};
