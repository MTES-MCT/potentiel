import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getCahierDesCharges } from '../utils/getCahierDesCharges';

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
  const cahierDesCharges = await getCahierDesCharges(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  if (!cahierDesCharges) {
    throw new Error(`Le cahier des charges du projet ${identifiantProjet} est introuvable.`);
  }

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
      autoritéCompétente: CahierDesCharges.bind(cahierDesCharges).getAutoritéCompétente('délai'),
    },
  );
};
