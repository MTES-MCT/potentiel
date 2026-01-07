import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiAnnuléeProjector = async ({
  payload: { identifiantProjet, dateDemande },
}: Lauréat.Délai.DemandeDélaiAnnuléeEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      statut: Lauréat.Délai.StatutDemandeDélai.annulé.statut,
    },
  );
};
