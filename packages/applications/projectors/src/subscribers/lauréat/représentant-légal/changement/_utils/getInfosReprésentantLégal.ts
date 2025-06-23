import { IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getInfosReprésentantLégal = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const représentantLégal = await findProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
  );

  if (Option.isNone(représentantLégal)) {
    getLogger().error(
      `Aucun représentant légal n'a été trouvé pour le changement de représentant accordé`,
      {
        identifiantProjet,
      },
    );
    return;
  }
  if (!représentantLégal.demandeEnCours) {
    getLogger().error(`Aucune demande en cours pour le changement de représentant accordé`, {
      identifiantProjet,
    });
    return;
  }

  const identifiantChangement = `${identifiantProjet}#${représentantLégal.demandeEnCours.demandéLe}`;

  const changementEnCours =
    await findProjection<Lauréat.ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantChangement}`,
    );

  if (Option.isNone(changementEnCours)) {
    getLogger().error(
      `Aucun changement de représentant légal n'a été trouvé pour le changement de représentant accordé`,
      {
        identifiantProjet,
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
