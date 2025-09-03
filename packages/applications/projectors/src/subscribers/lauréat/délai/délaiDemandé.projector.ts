import { mediator } from 'mediateur';

import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

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
  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    throw new Error('Cahier des charges non trouvé');
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
