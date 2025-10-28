import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiRejetéeProjector = async ({
  payload: { identifiantProjet, dateDemande, rejetéeLe, rejetéePar, réponseSignée },
}: Lauréat.Délai.DemandeDélaiRejetéeEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      statut: Lauréat.Délai.StatutDemandeDélai.rejeté.statut,
      rejet: {
        rejetéeLe,
        rejetéePar,
        réponseSignée: { format: réponseSignée.format },
      },
      miseÀJourLe: rejetéeLe,
    },
  );
};
