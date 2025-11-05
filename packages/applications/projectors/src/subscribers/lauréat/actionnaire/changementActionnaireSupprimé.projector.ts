import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjection,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementActionnaireSuppriméProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Actionnaire.ChangementActionnaireSuppriméEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, {
      identifiantProjet,
      fonction: 'changementActionnaireSuppriméProjector',
    });
    return;
  }

  if (!projectionToUpsert.dateDemandeEnCours) {
    getLogger().error(`Demande de changement d'actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireSuppriméProjector',
    });
    return;
  }

  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      dateDemandeEnCours: undefined,
    },
  );

  await removeProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${projectionToUpsert.dateDemandeEnCours}`,
  );
};
