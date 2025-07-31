import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiSuppriméeProjector = async ({
  payload: { identifiantProjet, dateDemande },
}: Lauréat.Délai.DemandeDélaiSuppriméeEvent) => {
  await removeProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
  );
};
