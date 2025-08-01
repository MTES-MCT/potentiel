import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeExecutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent) => {
  const identifiantTâche = `${typeTâchePlanifiée}#${identifiantProjet}`;

  await removeProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${identifiantTâche}`,
  );
};
