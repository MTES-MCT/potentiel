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

  const motif =
    event.type === 'DélaiDemandé-V2'
      ? event.payload.motif
      : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif;
  const autoritéCompétente = await getAutoritéCompétente(identifiantProjet, motif);

  await upsertProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${demandéLe}`,
    {
      identifiantProjet,
      statut: Lauréat.Délai.StatutDemandeDélai.demandé.statut,
      miseÀJourLe: demandéLe,
      demande: {
        motif,
        nombreDeMois,
        demandéPar,
        demandéLe,
        raison,
        pièceJustificative: {
          format,
        },
        autoritéCompétente,
      },
    },
  );
};
