import { Actionnaire } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementActionnaireDemandéProjector = async ({
  payload: {
    actionnaire,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Actionnaire.ChangementActionnaireDemandéEvent) => {
  const projectionToUpsert = await findProjection<Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Actionnaire non trouvé`, { identifiantProjet });
    return;
  }

  await upsertProjection<Actionnaire.ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: demandéLe,
  });

  await upsertProjection<Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      demande: {
        statut: Actionnaire.StatutChangementActionnaire.demandé.statut,
        nouvelActionnaire: actionnaire,
        demandéePar: demandéPar,
        demandéeLe: demandéLe,
        raison,
        pièceJustificative: {
          format,
        },
      },
    },
  );
};
