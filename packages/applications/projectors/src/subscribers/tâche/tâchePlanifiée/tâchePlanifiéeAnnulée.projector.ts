import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeAnnuléeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeAnnuléeEvent) => {
  await removeProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );
};
