import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getInfosReprésentantLégal = async (identifiantProjet: IdentifiantProjet.RawType) => {
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
  if (!représentantLégal.dernièreDemande) {
    getLogger().error(`Aucune demande en cours pour le changement de représentant accordé`, {
      event,
    });
    return;
  }

  const identifiantChangement = `${identifiantProjet}#${représentantLégal.dernièreDemande.demandéLe}`;

  const changementEnCours =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantChangement}`,
    );

  if (Option.isNone(changementEnCours)) {
    getLogger().error(
      `Aucun changement de représentant légal n'a été trouvé pour le changement de représentant accordé`,
      {
        event,
      },
    );
    return;
  }

  return {
    actuel: {
      nom: représentantLégal.nomReprésentantLégal,
      type: représentantLégal.typeReprésentantLégal,
    },
    identifiantChangement,
    changementEnCours,
  };
};
