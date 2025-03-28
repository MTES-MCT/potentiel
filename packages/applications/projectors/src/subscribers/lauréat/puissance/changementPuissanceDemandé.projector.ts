import { Puissance } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementPuissanceDemandéProjector = async ({
  payload: {
    puissance,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Puissance.ChangementPuissanceDemandéEvent) => {
  const projectionToUpsert = await findProjection<Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Puissance non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: demandéLe,
  });

  await upsertProjection<Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      demande: {
        statut: Puissance.StatutChangementPuissance.demandé.statut,
        nouvellePuissance: puissance,
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
