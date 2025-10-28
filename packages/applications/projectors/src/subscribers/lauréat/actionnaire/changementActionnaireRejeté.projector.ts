import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementActionnaireRejetéProjector = async ({
  payload: {
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
  },
}: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent) => {
  const actionnaire = await findProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
    getLogger().error(`Actionnaire ou demande en cours non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireRejetéProjector',
    });
    return;
  }

  const projectionToUpsert = await findProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Demande de changement d'actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireRejetéProjector',
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

  await upsertProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
    {
      identifiantProjet,
      miseÀJourLe: rejetéLe,
      demande: {
        ...projectionToUpsert.demande,
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.rejeté.statut,

        rejet: {
          rejetéeLe: rejetéLe,
          rejetéePar: rejetéPar,
          réponseSignée: {
            format,
          },
        },
      },
    },
  );
};
