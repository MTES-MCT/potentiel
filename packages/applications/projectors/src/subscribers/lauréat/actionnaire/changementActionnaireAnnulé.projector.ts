import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementActionnaireAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent) => {
  const actionnaire = await findProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
    getLogger('changementActionnaireAnnuléProjector').error(`Demande d'actionnaire non trouvée !`, {
      identifiantProjet,
    });
    return;
  }

  await upsertProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      ...actionnaire,
      dateDemandeEnCours: undefined,
    },
  );

  await updateOneProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
    {
      demande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.annulé.statut,
      },
    },
  );
};
