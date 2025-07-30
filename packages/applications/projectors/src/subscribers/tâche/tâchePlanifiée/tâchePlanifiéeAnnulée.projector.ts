import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeAnnuléeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeAnnuléeEvent) => {
    const identifiantTâche = `${identifiantProjet}#${typeTâchePlanifiée}#${àExécuterLe}`;

  //   const identifiantChangement = `${identifiantProjet}#${typeTâchePlanifiée}#${ajoutéeLe}`;

  const tâchePlanifiéeToRemove = await findProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `actionnaire|${identifiantProjet}`,
  );

  await removeProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );
};
