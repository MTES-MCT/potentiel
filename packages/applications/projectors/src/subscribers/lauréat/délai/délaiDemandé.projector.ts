import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const délaiDemandéProjector = async ({
  payload: {
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    nombreDeMois,
    pièceJustificative: { format },
  },
}: Lauréat.Délai.DélaiDemandéEvent) => {
  await upsertProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      statut: Lauréat.Délai.StatutDemandeDélai.demandé.statut,
      nombreDeMois,
      demandéPar,
      demandéLe,
      raison,
      pièceJustificative: {
        format,
      },
    },
  );
};
