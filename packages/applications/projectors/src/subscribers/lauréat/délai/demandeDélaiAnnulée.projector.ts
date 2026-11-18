import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiAnnuléeProjector = async ({
  payload: { identifiantProjet, dateDemande, annuléLe },
}: Lauréat.Délai.DemandeDélaiAnnuléeEvent | Lauréat.Délai.DemandeDélaiAnnuléeEventV1) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      miseÀJourLe: annuléLe,
      statut: Lauréat.Délai.StatutDemandeDélai.annulé.statut,
    },
  );
};
