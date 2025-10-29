import { Lauréat } from '@potentiel-domain/projet';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const changementPuissanceDemandéProjector = async ({
  payload: {
    puissance,
    puissanceDeSite,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Lauréat.Puissance.ChangementPuissanceDemandéEvent) => {
  const projectionToUpsert = await findProjection<Lauréat.Puissance.PuissanceEntity>(
    `puissance|${identifiantProjet}`,
  );

  if (Option.isNone(projectionToUpsert)) {
    getLogger().error(`Puissance non trouvée`, { identifiantProjet });
    return;
  }

  await upsertProjection<Lauréat.Puissance.PuissanceEntity>(`puissance|${identifiantProjet}`, {
    ...projectionToUpsert,
    dateDemandeEnCours: demandéLe,
  });

  await upsertProjection<Lauréat.Puissance.ChangementPuissanceEntity>(
    `changement-puissance|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      miseÀJourLe: demandéLe,
      demande: {
        statut: Lauréat.Puissance.StatutChangementPuissance.demandé.statut,
        nouvellePuissance: puissance,
        nouvellePuissanceDeSite: puissanceDeSite,
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
