import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâchePlanifiéeAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâchePlanifiée, ajoutéeLe, àExécuterLe },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeAjoutéeEvent) => {
  const identifiantChangement = `${identifiantProjet}#${typeTâchePlanifiée}#${ajoutéeLe}`;

  await upsertProjection<Lauréat.TâchePlanifiée.TâchePlanifiéeEntity>(
    `tâche-planifiée|${identifiantChangement}`,
    {
      identifiantProjet,
      typeTâche: typeTâchePlanifiée,
      misÀJourLe: ajoutéeLe,
      àExécuterLe,
    },
  );
};
