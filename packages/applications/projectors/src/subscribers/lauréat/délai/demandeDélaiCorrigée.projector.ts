import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getAutoritéCompétente } from './_helpers/getAutoritéCompétente.js';

export const demandeDélaiCorrigéeProjector = async (
  event: Lauréat.Délai.DemandeDélaiCorrigéeEvent | Lauréat.Délai.DemandeDélaiCorrigéeEventV1,
) => {
  const {
    payload: { identifiantProjet, dateDemande, raison, nombreDeMois, pièceJustificative },
  } = event;

  const motif =
    event.type === 'DemandeDélaiCorrigée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motif;

  const autoritéCompétente = await getAutoritéCompétente(identifiantProjet, motif);

  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${motif}#${dateDemande}`,
    {
      autoritéCompétente,
      demande: {
        nombreDeMois,
        raison,
        motif,
        ...(pièceJustificative && {
          pièceJustificative: { format: pièceJustificative.format },
        }),
      },
    },
  );
};
