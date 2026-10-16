import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getAutoritéCompétente } from './_helpers/getAutoritéCompétente.js';

export const délaiDemandéProjector = async (
  event: Lauréat.Délai.DélaiDemandéEvent | Lauréat.Délai.DélaiDemandéEventV1,
) => {
  const {
    identifiantProjet,
    demandéLe,
    demandéPar,
    raison,
    nombreDeMois,
    pièceJustificative: { format },
  } = event.payload;

  const motif: Lauréat.Délai.MotifDemandeDélai.RawType =
    event.type === 'DélaiDemandé-V2' ? event.payload.motif : 'force-majeure';
  const autoritéCompétente = await getAutoritéCompétente(identifiantProjet, motif);

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
      motif,
      autoritéCompétente,
      miseÀJourLe: demandéLe,
    },
  );
};
