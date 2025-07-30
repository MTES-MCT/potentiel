import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeExecutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée, exécutéeLe },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent) => {
  const identifiantTâche = `${identifiantProjet}#${typeTâchePlanifiée}#${exécutéeLe}`;

  await removeProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${identifiantTâche}`,
  );
};
