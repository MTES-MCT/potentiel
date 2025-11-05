import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjection,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

export const changementActionnaireAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, {
      identifiantProjet,
      fonction: 'changementActionnaireAnnuléProjector',
    });
    return;
  }

  if (!projectionToUpsert.dateDemandeEnCours) {
    getLogger().error(`Demande de changement d'actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireAnnuléProjector',
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
