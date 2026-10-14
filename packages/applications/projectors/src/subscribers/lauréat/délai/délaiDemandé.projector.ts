import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getCahierDesCharges } from '../utils/getCahierDesCharges.js';

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
  const cahierDesCharges = await getCahierDesCharges(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  if (!cahierDesCharges) {
    throw new Error(`Le cahier des charges du projet ${identifiantProjet} est introuvable.`);
  }

  const motif: Lauréat.Délai.MotifDemandeDélai.RawType =
    event.type === 'DélaiDemandé-V2' ? event.payload.motif : 'force-majeure';
  const autoritéCompétente =
    motif === 'prolongation-phase-essai'
      ? 'dgec'
      : (cahierDesCharges.getRèglesChangements('délai').autoritéCompétente ??
        Lauréat.Délai.AutoritéCompétente.DEFAULT_AUTORITE_COMPETENTE_DELAI);

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
