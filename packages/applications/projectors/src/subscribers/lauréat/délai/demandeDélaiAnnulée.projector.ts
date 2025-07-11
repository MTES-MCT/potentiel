import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiAnnuléeProjector = async ({
  payload: { identifiantProjet, dateDemande },
}: Lauréat.Délai.DemandeDélaiAnnuléeEvent) => {
  await removeProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
  );
};
