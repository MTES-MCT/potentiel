import { Actionnaire } from '@potentiel-domain/laureat';
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
}: Actionnaire.ChangementActionnaireRejetéEvent) => {
  const actionnaire = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
    getLogger().error(`Actionnaire ou demande en cours non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireRejetéProjector',
    });
    return;
  }

  const projectionToUpsert = await findProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Demande de changement d'actionnaire non trouvée`, {
      identifiantProjet,
      fonction: 'changementActionnaireRejetéProjector',
    });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...actionnaire,
    dateDemandeEnCours: undefined,
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${actionnaire.dateDemandeEnCours}`,
    {
      identifiantProjet,
      demande: {
        ...projectionToUpsert.demande,
        statut: Actionnaire.StatutChangementActionnaire.rejeté.statut,

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
