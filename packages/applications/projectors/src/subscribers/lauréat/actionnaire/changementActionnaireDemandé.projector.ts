import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementActionnaireDemandéProjector = async ({
  payload: {
    actionnaire,
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    pièceJustificative: { format },
  },
}: Lauréat.Actionnaire.ChangementActionnaireDemandéEvent) => {
  await updateOneProjection<Lauréat.Actionnaire.ActionnaireEntity>(
    `actionnaire|${identifiantProjet}`,
    {
      dernièreDemande: {
        statut: Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut,
        date: demandéLe,
      },
    },
  );

  await upsertProjection<Lauréat.Actionnaire.ChangementActionnaireEntity>(
    `changement-actionnaire|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      miseÀJourLe: demandéLe,
      statut: Lauréat.Actionnaire.StatutChangementActionnaire.demandé.statut,
      demande: {
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
